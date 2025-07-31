import type {
    Collections,
    Choosing25bRecord,
    SocietiesRecord,
    TypedPocketBase,
    BaseSystemFields,
    AuthSystemFields,
    UsersRecord,
    DatesRecord,
    UsersRoleOptions,
    UsersGenderOptions,
} from "./pocketbase-types.d.ts";
import dayjs from "dayjs";

export { Collections, TypedPocketBase, Choosing25bRecord, DatesRecord, UsersRoleOptions, UsersGenderOptions };

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
    timeStatus: TimeStatus | null;
    ip?: string;
}

export type LoginResponse = {
    userID: string;
    token: string;
    userInformation: {
        name: string;
        username: string;
        role: UsersRoleOptions;
    }
}

export type Batch = number | "adjust" | "core" | "not-admitted" | "not-full";

export interface AdmittedSociety {
    id: string;
    name: string;
    cap: number;
    coreMembers: string[];
    countMembers: number;
    adjustThreshold: number;
    lastBatch: Batch;
    lastTime: number | null;
}

export interface AdmittedUser {
    id: string;
    number: string;
    name: string;
    class: string;
    gender: UsersGenderOptions;
    society: AdmittedSociety | null;
    choices: AdmittedSociety[];
    rejects: AdmittedSociety[];
    batch: Batch;
    answer?: string;
    submit: number;
}

export interface AdmissionResult {
    users: AdmittedUser[];
    societies: AdmittedSociety[];
}
