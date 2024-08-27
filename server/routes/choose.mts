import RequestHandler from "../services/request-handler.mjs";
import { get_time_status } from "../services/time.mjs";
import type { CreateChoosingData } from '../../types/types.d.ts';

class ChooseRouter extends RequestHandler {
  static method = RequestHandler.POST;
  static path = "/";

  public async handle_core(): Promise<object | undefined> {
    const timeStatus = get_time_status();
    if (!timeStatus.open) {
      this.res.status(403).send("Time is not open for choosing.");
    }
    const authData = await this.authorize();
    const { first_choice, second_choice, third_choice } = this.req.body as CreateChoosingData;
    const user = authData.record.id;
    const data = {
      user,
      ip: this.req.ip,
      first_choice,
      second_choice,
      third_choice,
    };
    await this.check_response(this.databaseService.create_choosing(data));

    return {
      success: true,
    }
  }
}

export default RequestHandler.inject(ChooseRouter);
