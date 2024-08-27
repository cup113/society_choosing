import RequestHandler from "../services/request-handler.mjs";
import { get_time_status } from "../services/time.mjs";
import type { ListSocietyResponse } from "../../types/types.js";

class SocietiesRouter extends RequestHandler {
    static method = RequestHandler.GET;
    static path = "/list";

    protected async handle_core(): Promise<ListSocietyResponse> {
        return {
            societies: await this.check_response(this.databaseService.list_all_societies()),
            timeStatus: get_time_status(),
        }
    }
}

export default RequestHandler.inject(SocietiesRouter)
