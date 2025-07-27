import PocketBase from 'pocketbase';
import type { Choice, CreateSocietyInner, CreateUserInner, Society, TypedPocketBase, User, DatesRecord, CreateChoosingData } from '../../types/types.d.ts';
import logger from './logger.mjs';
import { env } from 'node:process';

export abstract class DatabaseService {
  // Users
  public abstract create_user(data: CreateUserInner): Promise<void>;
  public abstract list_users(): Promise<User[]>;

  // Societies
  public abstract create_society(data: CreateSocietyInner): Promise<void>;
  public abstract list_all_societies(): Promise<Society[]>;

  // Choosing
  public abstract create_or_update_choosing(data: CreateChoosingData): Promise<void>;
  public abstract get_choice(userID: string): Promise<Choice | null>;
  public abstract toggle_choice_reject(userID: string, societyID: string, reject: boolean): Promise<void>;

  // Dates
  public abstract get_date(id: string): Promise<DatesRecord>;
}

export class PocketBaseService extends DatabaseService {
  public pb: TypedPocketBase;

  constructor() {
    super();
    logger.info(`PocketBaseService initialized with URL ${env.POCKETBASE_URL}`);
    this.pb = new PocketBase(env.POCKETBASE_URL);
  }

  public async create_user(data: CreateUserInner): Promise<void> {
    await this.pb.collection("users").create({
      ...data,
      passwordConfirm: data.password,
    }, { requestKey: data.username });
  }

  public async list_users(): Promise<User[]> {
    return await this.pb.collection("users").getFullList({ requestKey: null });
  }

  public async create_society(data: CreateSocietyInner): Promise<void> {
    await this.pb.collection("societies").create(data, { requestKey: data.name });
  }

  public async list_all_societies(): Promise<Society[]> {
    return await this.pb.collection("societies").getFullList({ requestKey: null });
  }

  public async create_or_update_choosing(data: Choice): Promise<void> {
    try {
      const { id } = await this.pb.collection("choosing_25B").getFirstListItem(
        `user = "${data.user}"`, { requestKey: data.user }
      );
      await this.pb.collection("choosing_25B").update(id, data, { requestKey: data.user });
    } catch (e) {
      await this.pb.collection("choosing_25B").create(data, { requestKey: data.user });
    }
  }

  public async get_choice(userID: string): Promise<Choice | null> {
    try {
      return await this.pb.collection("choosing_25B").getFirstListItem(`user.id = ${userID}`, { requestKey: null });
    } catch (e) {
      return null;
    }
  }

  public async toggle_choice_reject(userID: string, societyID: string, reject: boolean): Promise<void> {
    const choice = (await this.pb.collection("choosing_25B").getList(1, 1, {
      requestKey: null,
      filter: `user.id = "${userID}"`,
    })).items[0];

    if (!choice) {
      throw new Error("Choice not found");
    }

    const rejects = choice.rejects;
    if (reject) {
      rejects.push(societyID);
    } else {
      rejects.splice(rejects.indexOf(societyID), 1);
    }
    await this.pb.collection("choosing_25B").update(choice.id, {
      rejects,
    });
  }

  public async get_date(id: string): Promise<DatesRecord> {
    return await this.pb.collection("dates").getOne(id);
  }
}
