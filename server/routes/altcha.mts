import RequestHandler from "../services/request-handler.mjs";
import type { Challenge } from 'altcha-lib/types';

class AltchaGetHandler extends RequestHandler {
    static method = RequestHandler.GET;
    static path = "/get";

    public async handle_core(): Promise<Challenge> {
        return await this.databaseService.create_altcha();
    }
}

export default RequestHandler.inject(
    AltchaGetHandler,
);
