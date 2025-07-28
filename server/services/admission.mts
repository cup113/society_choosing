import { PriorityQueue } from 'priority-queue-typed';
import type { User as RawUser, Society as RawSociety, Choice, Batch } from '../../types/types.js';
import logger from './logger.mjs';
import dayjs from 'dayjs';

interface Society {
    name: string;
    cap: number;
    coreMembers: string[];
    countMembers: number;
    adjustThreshold: number;
    lastBatch: Batch;
    lastTime: dayjs.Dayjs | null;
}

interface User {
    id: string;
    number: string;
    name: string;
    class: string;
    society: Society | null;
    choices: Society[];
    rejects: Society[];
    batch: Batch;
    answer?: string;
    submit: dayjs.Dayjs;
}

export default class AdmissionService {
    public users: User[];
    public societiesIdMap: Map<string, Society>;
    public startTime: dayjs.Dayjs;

    constructor(usersRaw: RawUser[], societiesRaw: RawSociety[], choosingRaw: Choice[], startTime: dayjs.Dayjs) {
        this.societiesIdMap = this.get_society_map(societiesRaw);
        this.users = this.get_users(usersRaw, choosingRaw);
        this.startTime = startTime;
    }

    static society_compare(a: Society, b: Society) {
        if (a.adjustThreshold !== b.adjustThreshold) {
            return a.adjustThreshold - b.adjustThreshold; // lower threshold first.
        }
        return a.countMembers / a.cap - b.countMembers / b.cap; // colder first
    }

    private get_users(usersRaw: RawUser[], choosingRaw: Choice[]): User[] {
        return usersRaw.filter(user => user.role === "student").map(user => {
            const choosingData = choosingRaw.find(data => data.user === user.id);
            const chosen = choosingData !== undefined;
            const choices: Society[] = [];

            let rejects = new Array<Society>();
            let answer: string | undefined = undefined;
            if (chosen) {
                choosingData.choices.forEach(societyId => {
                    choices.push(this.societiesIdMap.get(societyId)!);
                })
                choosingData.rejects?.forEach(rejectId => {
                    rejects.push(this.societiesIdMap.get(rejectId)!);
                })
                answer = choosingData.answers;
            }

            return {
                id: user.id,
                name: user.name,
                number: user.username.slice(3),
                class: user.class,
                society: null,
                batch: "not-admitted",
                choices,
                answer,
                rejects,
                // if not chosen, let the submit time be the latest.
                submit: dayjs(choosingData?.created),
            };
        });
    }

    private get_society_map(societiesRaw: RawSociety[]): Map<string, Society> {
        return new Map(societiesRaw.map(s => [s.id, {
            coreMembers: s.coreMembers ?? [],
            name: s.name,
            cap: s.cap,
            countMembers: 0,
            adjustThreshold: s.adjustThreshold ?? 0,
            lastBatch: "not-full",
            lastTime: null,
        }]));
    }

    private isRejectedBy(user: User, society: Society | null) {
        if (society === null) {
            return false;
        }
        return user.rejects.includes(society);
    }

    public admit_core_members() {
        this.societiesIdMap.forEach((s, id) => {
            for (let userID of s.coreMembers) {
                const user = this.users.find(u => u.id === userID)!;
                user.batch = "core";
                user.society = this.societiesIdMap.get(id)!;
            }
        })
    }

    public admit_choice(batch: number) {
        this.users.filter(user => user.society === null && !this.isRejectedBy(user, user.choices[batch])).sort((a, b) => {
            return a.submit.diff(b.submit);
        }).forEach(user => {
            const society = user.choices[batch];
            if (society === null || society.countMembers >= society.cap) {
                return;
            }
            society.countMembers++;
            user.society = society;
            user.batch = batch;
            logger.info(`User ${user.name} admitted to ${society.name} in batch ${batch}.`);
            if (society.countMembers === society.cap) {
                society.lastBatch = batch;
                society.lastTime = user.submit;
            }
        });
    }

    public admit_adjust() {
        this.users = this.users.sort((a, b) => {
            return b.submit.diff(a.submit);
        }); // make the latest submit admitted to the coldest society.

        let societiesPQ = new PriorityQueue<Society>(
            new Array(...this.societiesIdMap.values()).filter(s => s.countMembers < s.cap),
            { comparator: AdmissionService.society_compare }
        );

        while (true) {
            const firstUser = this.users.find(user => user.society === null);
            const society = societiesPQ.poll();
            if (firstUser === undefined || society === undefined) {
                break;
            }
            firstUser.society = society;
            society.countMembers++;
            firstUser.batch = "adjust";
            if (society.countMembers < society.cap) {
                societiesPQ.add(society);
            } else {
                society.lastBatch = "adjust";
                society.lastTime = firstUser.submit;
            }
        }
    }

    public admit() {
        this.admit_core_members();
        for (let i = 0; i < 3; i++) {
            this.admit_choice(i);
        }
        this.admit_adjust();
    }
}
