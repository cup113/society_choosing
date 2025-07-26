import type {
    Collections,
    Choosing24bRecord,
    SocietiesRecord,
    TypedPocketBase,
    BaseSystemFields,
    AuthSystemFields,
    UsersRecord,
    DatesRecord,
} from "./pocketbase-types.d.ts";

export { Collections, TypedPocketBase, Choosing24bRecord, DatesRecord };

export type TimeStatus = {
    open: true;
    endEta: number;
} | ({
    open: false;
} & ({
    reason: 'not-started',
    eta: number;
    endEta: number;
} | {
    reason: 'ended';
}));

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
