import PocketBase from 'pocketbase';

export type CreateUserData = {
  username: string;
  password: string;
  name: string;
  class: string;
  role: "student" | "teacher";
}

export type CreateUserResponse = {
  userID: string;
}

export type ListUsersResponse = {
  users: {
    id: string;
    name: string;
    number: string;
    role: "student" | "teacher";
    class: string;
    created: Date;
  }[];
}

export type CreateSocietyData = {
  name: string;
  cap: number;
  description: string;
}

export type CreateSocietyResponse = void;

export type ListSocietiesResponse = {
  societies: {
    id: string;
    name: string;
    cap: number;
    description: string;
  }[];
}

export type CreateChoosingData = {
  userID: string;
  ip?: string;
  first_choice: string;
  second_choice: string;
  third_choice: string;
}

export type CreateChoosingResponse = void;

export type ListChoosingResponse = {
  choices: {
    id: string;
    ip: string;
    userID: string;
    first_choice: string;
    second_choice: string;
    third_choice: string;
    created: string;
  }[];
}

export abstract class DatabaseService {
  // Users
  public abstract create_user(data: CreateUserData): Promise<CreateUserResponse>;
  public abstract list_users(): Promise<ListUsersResponse>;

  // Societies
  public abstract create_society(data: CreateSocietyData): Promise<CreateSocietyResponse>;
  public abstract list_all_societies(): Promise<ListSocietiesResponse>;

  // Choosing
  public abstract create_choosing(data: CreateChoosingData): Promise<CreateChoosingResponse>;
  public abstract list_choices(): Promise<ListChoosingResponse>;
}

export class PocketBaseService extends DatabaseService {
  public pb: PocketBase;

  constructor() {
    super();
    this.pb = new PocketBase("http://localhost:8090");
  }

  public async create_user(data: CreateUserData): Promise<CreateUserResponse> {
    const record = await this.pb.collection("users").create({
      ...data,
      passwordConfirm: data.password,
    }, { requestKey: data.username });
    return {
      userID: record.id,
    };
  }

  public async list_users(): Promise<ListUsersResponse> {
    const record = await this.pb.collection("users").getFullList({ requestKey: null });
    return {
      users: record.map(rec => {
        return {
          id: rec.id,
          name: rec.name,
          number: rec.username,
          role: rec.role,
          class: rec.class,
          created: new Date(rec.created),
        };
      }),
    };
  }

  public async create_society(data: CreateSocietyData): Promise<CreateSocietyResponse> {
    await this.pb.collection("societies").create({
      name: data.name,
      cap: data.cap,
      // TODO: description
    }, { requestKey: data.name });
  }

  public async list_all_societies(): Promise<ListSocietiesResponse> {
    const record = await this.pb.collection("societies").getFullList({ requestKey: null });
    return {
      societies: record.map(rec => {
        return {
          id: rec.id,
          name: rec.name,
          cap: rec.cap,
          description: rec.description,
        };
      }),
    };
  }

  public async create_choosing(data: CreateChoosingData): Promise<CreateChoosingResponse> {
    await this.pb.collection("choosing_24B").create({
      user: data.userID,
      ip: data.ip,
      first_choice: data.first_choice,
      second_choice: data.second_choice,
      third_choice: data.third_choice,
    }, { requestKey: data.userID });
  }

  public async list_choices(): Promise<ListChoosingResponse> {
    const record = await this.pb.collection("choosing_24B").getFullList({ requestKey: null });
    return {
      choices: record.map(rec => {
        return {
          id: rec.id,
          ip: rec.ip,
          userID: rec.user,
          first_choice: rec.first_choice,
          second_choice: rec.second_choice,
          third_choice: rec.third_choice,
          created: rec.created,
        };
      }),
    };
  }
}
