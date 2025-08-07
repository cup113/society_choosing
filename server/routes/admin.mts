import type { User, CreateUserInner, CreateDateInner, DatesRecord, CreateSocietyInner, Society } from "../../types/types.js";
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
    AdminUserGetHandler, AdminUserImportHandler, AdminUserDeleteHandler,
    AdminDateGetHandler, AdminDateCreateHandler, AdminDateActivateHandler,
    AdminSocietyImportHandler, AdminSocietyDeleteHandler, AdminSocietyUpdateHandler
);
