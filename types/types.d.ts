import type {
    Collections,
    Choosing25bRecord,
    SocietiesRecord,
    TypedPocketBase,
    BaseSystemFields,
    AuthSystemFields,
    UsersRecord,
    DatesRecord,
} from "./pocketbase-types.d.ts";

export { Collections, TypedPocketBase, Choosing25bRecord, DatesRecord };

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

export type CreateUserInner = Omit<UsersRecord, "id" | "tokenKey"> & { username: string; password: string };

export type CreateSocietyInner = Omit<SocietiesRecord, "id">;

export type User = UsersRecord;

export type Society = SocietiesRecord;

export type Choice = Choosing25bRecord;

export type HistoryChoiceResponse = { result: Choice | null };

export type CreateChoosingData = Omit<Choosing25bRecord, "user" | "id" | "created" | "updated">;

export type ListSocietyResponse = {
    societies: Society[];
    timeStatus: TimeStatus;
    ip?: string;
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

export type Batch = number | "adjust" | "core" | "not-admitted" | "not-full";
