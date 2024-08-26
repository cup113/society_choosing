import RequestHandler from "../services/request-handler.mjs";
import { get_time_status } from "../services/time.mjs";

class SocietiesRouter extends RequestHandler {
    static method = RequestHandler.GET;
    static path = "/list";

    protected async handle_core(): Promise<object | undefined> {
        return {
            societies: (await this.check_response(this.databaseService.list_all_societies())).societies,
            timeStatus: get_time_status(),
        }
    }
}

export default RequestHandler.inject(SocietiesRouter)
