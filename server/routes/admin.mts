import type { User, CreateUserInner, CreateDateInner, DatesRecord, CreateSocietyInner, Society, Choice } from "../../types/types.js";
import RequestHandler from "../services/request-handler.mjs";

class AdminUserGetHandler extends RequestHandler {
    static method = RequestHandler.GET;
    static path = "/user/list";

    public async handle_core(): Promise<User[]> {
        await this.authorize();
        return await this.databaseService.list_users();
    }
}

class AdminUserImportHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/user/import";

    public async handle_core(): Promise<User[]> {
        await this.authorize();
        const users = this.req.body as CreateUserInner[];
        return await Promise.all(users.map(user => {
            const { password, username, ...remaining } = user;
            const realPassword = username.match(/[0-9]{9}/) ? `${username.substring(4, 10)}@${password}` : password;

            return this.databaseService.create_or_update_user({
                username,
                password: realPassword,
                ...remaining
            });
        }));
    }
}

class AdminUserDeleteHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/user/delete";

    public async handle_core(): Promise<{ success: true }> {
        await this.authorize();
        const user_ids = this.req.body as string[];
        await Promise.all(user_ids.map(user_id => this.databaseService.delete_user(user_id)));
        return { success: true };
    }
}

class AdminUserUpdateHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/user/update";

    public async handle_core(): Promise<User> {
        await this.authorize();
        const { id, ...userData } = this.req.body as Partial<CreateUserInner> & { id: string };
        return await this.databaseService.update_user(id, userData);
    }
}

class AdminDateGetHandler extends RequestHandler {
    static method = RequestHandler.GET;
    static path = "/date/list";

    public async handle_core(): Promise<DatesRecord[]> {
        await this.authorize();
        return await this.databaseService.list_dates();
    }
}

class AdminDateCreateHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/date/create";

    public async handle_core(): Promise<DatesRecord> {
        await this.authorize();
        const date = this.req.body as CreateDateInner;
        return await this.databaseService.create_date(date);
    }
}

class AdminDateActivateHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/date/activate";

    public async handle_core(): Promise<DatesRecord> {
        await this.authorize();
        const { id, activate } = this.req.body as { id: string, activate: boolean };
        return await this.databaseService.toggle_activate_date(id, activate);
    }
}

class AdminDateDeleteHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/date/delete";

    public async handle_core(): Promise<{ success: true }> {
        await this.authorize();
        const { id } = this.req.body as { id: string };
        await this.databaseService.delete_date(id);
        return { success: true };
    }
}

class AdminDateUpdateHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/date/update";

    public async handle_core(): Promise<DatesRecord> {
        await this.authorize();
        const { id, ...date } = this.req.body as Partial<CreateDateInner> & { id: string };
        return await this.databaseService.update_date(id, date);
    }
}

class AdminChoiceListHandler extends RequestHandler {
    static method = RequestHandler.GET;
    static path = "/choice/list";

    public async handle_core(): Promise<Choice[]> {
        await this.authorize();
        return await this.databaseService.list_choosing();
    }
}

class AdminChoiceDeleteByDateHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/choice/delete-by-date";

    public async handle_core(): Promise<{ deletedCount: number }> {
        await this.authorize();
        const { startDate, endDate } = this.req.body as { startDate: string; endDate: string };
        const choices = await this.databaseService.list_choosing();
        const idsToDelete = choices
            .filter(choice => {
                if (!choice.created) {
                    return false;
                }
                const choiceDate = new Date(choice.created);
                return choiceDate >= new Date(startDate) && choiceDate <= new Date(endDate);
            })
            .map(choice => choice.id);

        await Promise.all(idsToDelete.map(id => this.databaseService.delete_choice(id)));
        return { deletedCount: idsToDelete.length };
    }
}

class AdminChoiceClearHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/choice/clear";

    public async handle_core(): Promise<{ deletedCount: number }> {
        await this.authorize();
        const choices = await this.databaseService.list_choosing();
        const idsToDelete = choices.map(choice => choice.id);
        await Promise.all(idsToDelete.map(id => this.databaseService.delete_choice(id)));
        return { deletedCount: idsToDelete.length };
    }
}


class AdminSocietyImportHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/society/import";

    public async handle_core(): Promise<Society[]> {
        await this.authorize();
        const societies = this.req.body as CreateSocietyInner[];
        return await Promise.all(societies.map(society => this.databaseService.create_or_update_society(society)));
    }
}

class AdminSocietyDeleteHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/society/delete";

    public async handle_core(): Promise<{ success: true }> {
        await this.authorize();
        const society_ids = this.req.body as string[];
        await Promise.all(society_ids.map(society_id => this.databaseService.delete_society(society_id)));
        return { success: true };
    }
}

class AdminSocietyUpdateHandler extends RequestHandler {
    static method = RequestHandler.POST;
    static path = "/society/update";

    public async handle_core(): Promise<Society> {
        await this.authorize();
        const { id, ...society } = this.req.body as Partial<CreateSocietyInner> & { id: string };
        return await this.databaseService.update_society(id, society);
    }
}

export default RequestHandler.inject(
    AdminUserGetHandler, AdminUserImportHandler, AdminUserDeleteHandler, AdminUserUpdateHandler,
    AdminDateGetHandler, AdminDateCreateHandler, AdminDateActivateHandler, AdminDateDeleteHandler, AdminDateUpdateHandler,
    AdminChoiceListHandler, AdminChoiceDeleteByDateHandler, AdminChoiceClearHandler,
    AdminSocietyImportHandler, AdminSocietyDeleteHandler, AdminSocietyUpdateHandler
);
