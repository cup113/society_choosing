import type PocketBase from "pocketbase";
import type { RecordAuthResponse, RecordModel } from "pocketbase";
import { PocketBaseService, type DatabaseService } from './database.mjs';

type AuthorizationResult = { success: true, authData: RecordAuthResponse<RecordModel> } | { success: false, code: number, error: string };

export abstract class AuthorizationService {
  public databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  public abstract authorize(authorization: string | undefined): Promise<AuthorizationResult>;

  public abstract auth_with_password(username: string, password: string): Promise<AuthorizationResult>;

  public abstract auth_admin(email: string, password: string): Promise<void>;
}

export class PocketBaseAuthorizationService extends AuthorizationService {
  private pb: PocketBase;

  constructor(databaseService: PocketBaseService) {
    super(databaseService);
    this.pb = databaseService.pb;
  }

  public async authorize(authorization: string): Promise<AuthorizationResult> {
    if (!authorization) {
      return { success: false, code: 401, error: 'Unauthorized' };
    }
    const authorization_split = authorization.split(' ');
    if (authorization_split[0] !== 'Bearer' || authorization_split.length !== 2) {
      return { success: false, code: 401, error: 'Invalid authorization header' };
    }
    const token = authorization_split[1];
    this.pb.authStore.save(token);
    let authData: RecordAuthResponse<RecordModel>;
    try {
      authData = await this.pb.collection('users').authRefresh();
    } catch (error) {
      return { success: false, code: 401, error: 'Invalid token' };
    }
    if (!this.pb.authStore.isValid) {
      return { success: false, code: 401, error: 'Invalid token' };
    }
    return { success: true, authData };
  }

  public async auth_with_password(username: string, password: string): Promise<AuthorizationResult> {
    try {
      const authData = await this.pb.collection('users').authWithPassword(username, password);
      await this.pb.collection('users').authRefresh();
      if (!this.pb.authStore.isValid) {
        throw '';
      }
      return { success: true, authData };
    } catch (error) {
      return { success: false, code: 401, error: 'Invalid username or password' };
    }
  }

  public async auth_admin(email: string, password: string): Promise<void> {
    const authResult = await this.pb.admins.authWithPassword(email, password);
  }
}
