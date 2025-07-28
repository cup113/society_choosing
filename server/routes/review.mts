import type { AdmissionResult } from "../../types/types.js";
import RequestHandler from "../services/request-handler.mjs";
import AdmissionService from "../services/admission.mjs";
import TimeService from "../services/time.mjs";
import dayjs from "dayjs";
import logger from "../services/logger.mjs";

class ReviewToggleHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/toggle";

    protected async handle_core(): Promise<{ success: true }> {
        const { reject, societyID, userID } = this.req.body as { reject: boolean, societyID: string, userID: string };
        await this.authorize();
        await this.check_response(this.databaseService.toggle_choice_reject(userID, societyID, reject))
        return { success: true };
    }
}

class ReviewDashboardHandler extends RequestHandler {
    static method = RequestHandler.GET;
    static path = "/dashboard";

    protected async handle_core(): Promise<AdmissionResult> {
        await this.authorize();
        const usersRaw = await this.databaseService.list_users();
        const societiesRaw = await this.databaseService.list_all_societies();
        const choosingRaw = await this.databaseService.list_choosing();
        const start = dayjs(await new TimeService(this.databaseService).get_start_time());

        const admissionService = new AdmissionService(
            usersRaw,
            societiesRaw,
            choosingRaw,
            start,
        );

        return admissionService.admit();
    }
}

export default RequestHandler.inject(ReviewToggleHandler, ReviewDashboardHandler);
