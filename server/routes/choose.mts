import RequestHandler from "../services/request-handler.mjs";
import TimeService from "../services/time.mjs";
import type { CreateChoosingData, HistoryChoiceResponse } from '../../types/types.d.ts';
import { CodeType } from "../../types/codes.js";

class ChooseRouter extends RequestHandler {
  static method = RequestHandler.POST;
  static path = "/";

  public async handle_core(): Promise<{ success: true }> {
    const timeStatus = await new TimeService(this.databaseService).get_time_status();
    if (timeStatus === null) {
      throw new this.Terminate(CodeType.Unauthorized, "There is no active activities. How can you get here? UI Bugs or Illegal Attempts?")
    }
    if (!timeStatus.open) {
      throw new this.Terminate(CodeType.Forbidden, "Time is not open for choosing. How can you get here? UI Bugs or Illegal Attempts?");
    }
    const authData = await this.authorize();
    const { choices, answers } = this.req.body as CreateChoosingData;
    const user = authData.record.id;
    const ip = (this.req.headers['x-forwarded-for'] as string) ?? this.req.ip;
    const data = {
      user,
      ip,
      choices,
      answers,
    };
    await this.check_response(this.databaseService.create_or_update_choosing(data));

    return {
      success: true,
    }
  }
}

class ChooseHistoryRouter extends RequestHandler {
  static method = RequestHandler.GET;
  static path = "/";

  public async handle_core(): Promise<HistoryChoiceResponse> {
    const { record: { id } } = await this.authorize();
    const choice = await this.check_response(this.databaseService.get_choice(id));
    return { result: choice };
  }
}

export default RequestHandler.inject(ChooseRouter, ChooseHistoryRouter);
