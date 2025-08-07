import RequestHandler from "../services/request-handler.mjs";
import type { LoginResponse } from "../../types/types.d.ts";

class LoginHandler extends RequestHandler {
  static method = RequestHandler.POST;
  static path = '/';

  public async handle_core(): Promise<LoginResponse> {
    const { username, password }: { username: string, password: string } = this.req.body;
    const realPassword = username.match(/[0-9]{9}/) ? `${username.substring(4, 10)}@${password}` : password
    const authResult = await this.authorizationService.auth_with_password(username, realPassword);
    if (!authResult.success) {
      throw new this.Terminate(authResult.code, authResult.error);
    }
    const authData = authResult.authData;

    return {
      userID: authData.record.id,
      token: authData.token,
      userInformation: {
        name: authData.record.name,
        role: authData.record.role,
        username: authData.record.username,
      },
    }
  }
}

export default RequestHandler.inject(LoginHandler);
