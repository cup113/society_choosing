import PocketBase from 'pocketbase';
import type { Choice, CreateSocietyInner, CreateUserInner, Society, TypedPocketBase, User, DatesRecord, CreateChoosingData, CreateDateInner } from '../../types/types.d.ts';
import logger from './logger.mjs';
import { env } from 'node:process';
import dayjs from 'dayjs';

export abstract class DatabaseService {
  // Users
  public abstract create_or_update_user(data: CreateUserInner): Promise<User>;
  public abstract list_users(): Promise<User[]>;
  public abstract delete_user(id: string): Promise<void>;
  public abstract update_user(id: string, data: Partial<CreateUserInner>): Promise<User>;

  // Societies
  public abstract create_or_update_society(data: CreateSocietyInner): Promise<Society>;
  public abstract update_society(id: string, data: Partial<CreateSocietyInner>): Promise<Society>;
  public abstract delete_society(id: string): Promise<void>;
  public abstract list_all_societies(): Promise<Society[]>;

  // Choosing
  public abstract create_or_update_choosing(data: CreateChoosingData): Promise<Choice>;
  public abstract get_choice(userID: string): Promise<Choice | null>;
  public abstract list_choosing(): Promise<Choice[]>;
  public abstract toggle_choice_reject(userID: string, societyID: string, reject: boolean): Promise<Choice>; public abstract delete_choice(id: string): Promise<void>;

  // Dates
  public abstract list_dates(): Promise<DatesRecord[]>;
  public abstract create_date(data: CreateDateInner): Promise<DatesRecord>;
  public abstract toggle_activate_date(dateID: string, activate: boolean): Promise<DatesRecord>;
  public abstract delete_date(id: string): Promise<void>;
  public abstract update_date(id: string, data: Partial<CreateDateInner>): Promise<DatesRecord>;
  public abstract get_active_date(): Promise<DatesRecord | null>;
}

export class PocketBaseService extends DatabaseService {
  public pb: TypedPocketBase;

  constructor() {
    super();
    this.pb = new PocketBase(env.POCKETBASE_URL);
  }

  public async create_or_update_user(data: CreateUserInner): Promise<User> {
    const newUser = {
      ...data,
      passwordConfirm: data.password,
    };
    try {
      const userExisting = await this.pb.collection("users").getFirstListItem(`username="${data.username}"`, { requestKey: null });
      return await this.pb.collection("users").update(userExisting.id, newUser, { requestKey: data.username });
    } catch (e) {
      return await this.pb.collection("users").create(newUser, { requestKey: data.username });
    }
  }

  public async list_users(): Promise<User[]> {
    return await this.pb.collection("users").getFullList({ requestKey: null });
  }

  public async delete_user(id: string): Promise<void> {
    await this.pb.collection("users").delete(id);
  }

  public async update_user(id: string, data: Partial<CreateUserInner>): Promise<User> {
    if (data.password) {
      return await this.pb.collection("users").update(id, {
        ...data,
        passwordConfirm: data.password,
      }, { requestKey: data.username });
    }

    return await this.pb.collection("users").update(id, data, { requestKey: data.username });
  }


  public async create_or_update_society(data: CreateSocietyInner): Promise<Society> {
    try {
      const societyExisting = await this.pb.collection("societies").getFirstListItem(`name="${data.name}"`, { requestKey: null });
      return await this.pb.collection("societies").update(societyExisting.id, data, { requestKey: data.name });
    } catch (e) {
      return await this.pb.collection("societies").create(data);
    }
  }

  public async update_society(id: string, data: Partial<CreateSocietyInner>): Promise<Society> {
    return await this.pb.collection("societies").update(id, data, { requestKey: data.name });
  }

  public async delete_society(id: string): Promise<void> {
    await this.pb.collection("societies").delete(id);
  }

  public async list_all_societies(): Promise<Society[]> {
    return await this.pb.collection("societies").getFullList({ requestKey: null });
  }

  public async create_or_update_choosing(data: Choice): Promise<Choice> {
    logger.info(`User choosing at ${dayjs().toISOString()}: ${JSON.stringify(data)}`);
    try {
      const { id } = await this.pb.collection("choosing_25B").getFirstListItem(
        `user = "${data.user}"`, { requestKey: data.user }
      );
      return await this.pb.collection("choosing_25B").update(id, data, { requestKey: data.user });
    } catch (e) {
      return await this.pb.collection("choosing_25B").create(data, { requestKey: data.user });
    }
  }

  public async get_choice(userID: string): Promise<Choice | null> {
    try {
      return await this.pb.collection("choosing_25B").getFirstListItem(`user.id="${userID}"`, { requestKey: null });
    } catch (e) {
      return null;
    }
  }

  public async list_choosing(): Promise<Choice[]> {
    return await this.pb.collection("choosing_25B").getFullList();
  }

  public async toggle_choice_reject(userID: string, societyID: string, reject: boolean): Promise<Choice> {
    const choice = (await this.pb.collection("choosing_25B").getList(1, 1, {
      requestKey: null,
      filter: `user.id="${userID}"`,
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
    return await this.pb.collection("choosing_25B").update(choice.id, {
      rejects,
    });
  }

  public async delete_choice(id: string): Promise<void> {
    await this.pb.collection("choosing_25B").delete(id);
  }


  public async list_dates(): Promise<DatesRecord[]> {
    return await this.pb.collection("dates").getFullList();
  }

  public async create_date(data: DatesRecord): Promise<DatesRecord> {
    return await this.pb.collection("dates").create(data);
  }

  public async toggle_activate_date(dateID: string, activate: boolean): Promise<DatesRecord> {
    return await this.pb.collection("dates").update(dateID, {
      isActive: activate,
    });
  }

  public async delete_date(id: string): Promise<void> {
    await this.pb.collection("dates").delete(id);
  }

  public async update_date(id: string, data: Partial<CreateDateInner>): Promise<DatesRecord> {
    return await this.pb.collection("dates").update(id, data);
  }

  public async get_active_date(): Promise<DatesRecord | null> {
    try {
      return await this.pb.collection("dates").getFirstListItem("isActive=true");
    } catch (e) {
      return null;
    }
  }
}
