import type {
    Collections,
    Choosing24bRecord,
    SocietiesRecord,
    TypedPocketBase,
    BaseSystemFields,
    AuthSystemFields,
    UsersRecord,
} from "./pocketbase-types.d.ts";

import type { get_time_status } from '../server/services/time.mjs';

export { Collections, TypedPocketBase, Choosing24bRecord };

export type TimeStatus = ReturnType<get_time_status>;

export type CreateUserInner = UsersRecord & { username: string; password: string };

export type CreateSocietyInner = SocietiesRecord;

export type User = UsersRecord & Pick<AuthSystemFields, "id" | "created" | "username">;

export type Society = SocietiesRecord & Pick<BaseSystemFields, 'id'>;

export type Choice = Choosing24bRecord & Pick<BaseSystemFields, 'id' | 'created'>;

export type CreateChoosingData = Omit<Choosing24bRecord, "ip" | "user">;

export type ListSocietyResponse = {
    societies: Society[];
    timeStatus: TimeStatus;
    ip?: string;
}

export type ListHistoryResponse = {
    totalItems: number;
    items: Choice[];
}

export type LoginResponse = {
    userID: string;
    token: string;
    userInformation: {
        name: string;
        username: string;
        role: string;
    }
}

export type ListSocietyUser = User & Pick<Choice, 'answer'> & { rejected: boolean };

export type ListSocietyUserResponse = Record<'first_choice' | 'second_choice' | 'third_choice', ListSocietyUser[]>
