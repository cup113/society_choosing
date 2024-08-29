import PocketBase from 'pocketbase';
import type { Choice, CreateSocietyInner, CreateUserInner, Society, TypedPocketBase, User, Choosing24bRecord } from '../../types/types.d.ts';

export abstract class DatabaseService {
  // Users
  public abstract create_user(data: CreateUserInner): Promise<void>;
  public abstract list_users(): Promise<User[]>;

  // Societies
  public abstract create_society(data: CreateSocietyInner): Promise<void>;
  public abstract list_all_societies(): Promise<Society[]>;

  // Choosing
  public abstract create_choosing(data: Choosing24bRecord): Promise<void>;
  public abstract list_choices(): Promise<Choice[]>;
}

export class PocketBaseService extends DatabaseService {
  public pb: TypedPocketBase;

  constructor() {
    super();
    this.pb = new PocketBase("http://localhost:8090");
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
}
