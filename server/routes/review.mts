import type { User, ListSocietyUserResponse } from "../../types/types.d.ts";
import RequestHandler from "../services/request-handler.mjs";

class ReviewListHandler extends RequestHandler {
    static method = RequestHandler.GET;
    static path = "/list";

    protected async handle_core(): Promise<object | undefined> {
        const { societyID } = this.req.query as { societyID: string };
        await this.authorize();
        const choices = await this.check_response(this.databaseService.list_choices());
        const users = await this.check_response(this.databaseService.list_users());

        const usersWithBatch = users.map(user => {
            const choice = choices.find(choice => choice.user === user.id);
            if (!choice) {
                return;
            }
            const batch = choice.first_choice === societyID ? "first_choice" as const : (choice.second_choice === societyID ? "second_choice" as const : (choice.third_choice === societyID ? "third_choice" as const : null));
            return {
                ...user,
                batch,
                answer: choice.answer ?? "/",
                rejected: (choice.rejects ?? []).includes(societyID ?? ""),
            };
        }).filter(user => user !== undefined).filter(user => user.batch !== null);

        const data: ListSocietyUserResponse = {
            'first_choice': [],
            'second_choice': [],
            'third_choice': [],
        }
        usersWithBatch.forEach(user => {
            data[user.batch!].push(user);
        });
        return data;
    }
}

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

export default RequestHandler.inject(ReviewListHandler, ReviewToggleHandler);
