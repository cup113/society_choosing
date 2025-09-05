import RequestHandler from "../services/request-handler.mjs";
import type { LoginResponse } from "../../types/types.d.ts";
import { verifySolution } from 'altcha-lib';
import type { Payload } from "altcha-lib/types";
import { CodeType } from "../../types/codes.js";

class LoginHandler extends RequestHandler {
  static method = RequestHandler.POST;
  static path = '/';

  private async verify_altcha(payload: Payload): Promise<boolean> {
    const altcha = await this.databaseService.get_altcha(payload.challenge);
    if (altcha === null) {
      return false;
    }
    const verified = await verifySolution(payload, altcha.hmacKey);
    if (verified) {
      await this.databaseService.delete_altcha(altcha.id);
    }
    return verified;
  }

  public async handle_core(): Promise<LoginResponse> {
    const { username, password, altcha }: { username: string, password: string, altcha: string } = this.req.body;
    const payloadAscii = Buffer.from(altcha, 'base64').toString("utf-8");
    this.logger.info(`Login request of ${username}: ALTCHA ${payloadAscii})}`);
    const payload = JSON.parse(payloadAscii);
    if (!(await this.verify_altcha(payload))) {
      throw new this.Terminate(CodeType.AuthFailed, "未通过人机验证");
    }
    const realPassword = username.match(/[0-9]{9}/) ? `${username.substring(3, 9)}@${password}` : password;
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
