import RequestHandler from "../services/request-handler.mjs";
import { CodeType } from "../../types/codes.js";
import type { CapVerifyResponse } from "../../types/types.d.ts";
import { CapService } from "../services/cap.mjs";
import logger from "../services/logger.mjs";

class CapRedeemHandler extends RequestHandler {
  static method = RequestHandler.POST;
  static path = '/redeem';

  private capService: CapService;

  constructor(req: any, res: any) {
    super(req, res);
    this.capService = new CapService(this.databaseService);
  }

  public async handle_core(): Promise<any> {
    const { token, solutions }: { token: string, solutions: any } = this.req.body;

    if (!token || !solutions) {
      throw new this.Terminate(CodeType.BadRequest, 'Missing token or solutions');
    }

    try {
      const result = await this.capService.redeemChallenge(token, solutions);
      return result;
    } catch (error) {
      throw new this.Terminate(CodeType.BadRequest, 'Failed to redeem CAP challenge');
    }
  }
}

class CapChallengeHandler extends RequestHandler {
  static method = RequestHandler.POST;
  static path = '/challenge';

  private capService: CapService;

  constructor(req: any, res: any) {
    super(req, res);
    this.capService = new CapService(this.databaseService);
  }

  public async handle_core(): Promise<any> {
    try {
      const challenge = await this.capService.createChallenge();
      return challenge;
    } catch (error) {
      throw new this.Terminate(CodeType.InternalError, 'Failed to create CAP challenge');
    }
  }
}

class CapHandler extends RequestHandler {
  static method = RequestHandler.POST;
  static path = '/';

  private capService: CapService;

  constructor(req: any, res: any) {
    super(req, res);
    this.capService = new CapService(this.databaseService);
  }

  public async handle_core(): Promise<CapVerifyResponse> {
    const { token }: { token: string } = this.req.body;

    if (!token) {
      throw new this.Terminate(CodeType.BadRequest, 'Missing CAP token');
    }

    try {
      const result = await this.capService.validateToken(token);

      if (!result.success) {
        throw new this.Terminate(CodeType.BadRequest, 'Invalid CAP token');
      }

      return { success: true };
    } catch (error) {
      logger.error(`CAP validation failed: ${error}`);
      throw new this.Terminate(CodeType.BadRequest, 'CAP validation failed');
    }
  }
}

export default RequestHandler.inject(CapHandler, CapChallengeHandler, CapRedeemHandler);