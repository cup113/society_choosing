import PocketBase from 'pocketbase';
import type { Choice, CreateSocietyInner, CreateUserInner, Society, TypedPocketBase, User, Choosing24bRecord, DatesRecord, CreateChoosingData } from '../../types/types.d.ts';
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
  public abstract create_choosing(data: CreateChoosingData): Promise<void>;
  public abstract list_choices(): Promise<Choice[]>;
  public abstract toggle_choice_reject(userID: string, societyID: string, reject: boolean): Promise<void>;
  public abstract delete_duplicated_choices(): Promise<void>;

  // Dates
  public abstract get_date(id: string): Promise<DatesRecord>;
}

export class PocketBaseService extends DatabaseService {
  public pb: TypedPocketBase;

  constructor() {
    super();
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

  public async create_choosing(data: Choosing24bRecord): Promise<void> {
    await this.pb.collection("choosing_24B").create(data, { requestKey: data.user });
  }

  public async list_choices(): Promise<Choice[]> {
    return await this.pb.collection("choosing_24B").getFullList({  sort: "-created", requestKey: null });
  }

  public async toggle_choice_reject(userID: string, societyID: string, reject: boolean): Promise<void> {
    const choice = (await this.pb.collection("choosing_24B").getList(1, 1, {
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
    await this.pb.collection("choosing_24B").update(choice.id, {
      rejects,
    });
  }

  public async delete_duplicated_choices(): Promise<void> {
    // delete duplicated choices, keep the earliest one
    const choices = await this.pb.collection("choosing_24B").getFullList({
      requestKey: null,
      sort: "+created",
    });
    const choiceIdMap = new Map<string, string>();

    const duplicatedChoices = choices.filter(choice => {
      const key = `${choice.user}-${choice.first_choice}-${choice.second_choice}-${choice.third_choice}`;
      if (choiceIdMap.has(key)) {
        return true;
      }
      choiceIdMap.set(key, choice.id);
      return false;
    });

    await Promise.all(duplicatedChoices.map(choice => {
      this.pb.collection("choosing_24B").delete(choice.id, { requestKey: choice.id });
      logger.info(`Deleted duplicated choice (uid=${choice.user}, id=${choice.id})`)
    }));
  }

  public async get_date(id: string): Promise<DatesRecord> {
    return await this.pb.collection("dates").getOne(id);
  }
}
