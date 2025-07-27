import RequestHandler from "../services/request-handler.mjs";

class ReviewToggleHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/toggle";

    protected async handle_core(): Promise<object | undefined> {
        const { reject, societyID, userID } = this.req.body as { reject: boolean, societyID: string, userID: string };
        await this.authorize();
        await this.check_response(this.databaseService.toggle_choice_reject(userID, societyID, reject))
        return { success: true };
    }
}

export default RequestHandler.inject(ReviewToggleHandler);
