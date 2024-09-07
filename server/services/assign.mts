import { PriorityQueue } from 'priority-queue-typed';
import type { User as RawUser, Society as RawSociety, Choice } from '../../types/types.d.ts';
import logger from './logger.mjs';
import { startTime } from './time.mjs';

interface Society {
    name: string;
    cap: number;
    coreMembers: string[];
    countMembers: number;
    adjustThreshold: number;
    lastBatch: "first_choice" | "second_choice" | "third_choice" | "adjust" | null;
    lastTime: Date | null;
}

interface User {
    id: string;
    number: string;
    name: string;
    class: string;
    society: Society | null;
    first_choice: Society | null;
    second_choice: Society | null;
    third_choice: Society | null;
    rejects: Society[];
    batch: "first_choice" | "second_choice" | "third_choice" | "adjust" | null;
    answer?: string;
    submit: Date;
}

export default class AssignService {
    public users: User[];
    public societiesIdMap: Map<string, Society>;

    constructor(usersRaw: RawUser[], societiesRaw: RawSociety[], choosingRaw: Choice[]) {
        this.societiesIdMap = this.get_society_map(societiesRaw);
        this.users = this.get_users(usersRaw, choosingRaw);
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

            let first_choice = null as Society | null;
            let second_choice = null as Society | null;
            let third_choice = null as Society | null;
            let rejects = new Array<Society>();
            let answer: string | undefined = undefined;
            if (chosen) {
                first_choice = this.societiesIdMap.get(choosingData.first_choice)!;
                second_choice = this.societiesIdMap.get(choosingData.second_choice)!;
                third_choice = this.societiesIdMap.get(choosingData.third_choice)!;
                choosingData.rejects?.forEach(rejectId => {
                    rejects.push(this.societiesIdMap.get(rejectId)!);
                })
                answer = choosingData.answer;
            }

            return {
                id: user.id,
                name: user.name,
                number: user.username.slice(3),
                class: user.class,
                society: null,
                batch: null,
                first_choice,
                second_choice,
                third_choice,
                answer,
                rejects,
                // if not chosen, let the submit time be the latest.
                submit: new Date(choosingData?.created ?? Date.now()),
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
            lastBatch: null,
            lastTime: null,
        }]));
    }

    private isRejectedBy(user: User, society: Society | null) {
        if (society === null) {
            return false;
        }
        return user.rejects.includes(society);
    }

    public assign_choice(batch: 'first_choice' | 'second_choice' | 'third_choice') {
        const users = this.users.filter(user => user.society === null && !this.isRejectedBy(user, user[batch])).map(user => {
            const batchSociety = user[batch];
            return {
                user,
                isCore: batchSociety?.coreMembers?.includes(user.id),
            };
        }).sort((a, b) => {
            if (a.isCore && !b.isCore) {
                return -1;
            }
            if (!a.isCore && b.isCore) {
                return 1;
            }
            return a.user.submit.getTime() - b.user.submit.getTime();
        });

        for (const user of users) {
            const society = user.user[batch];
            if (society === null || society.countMembers >= society.cap) {
                continue;
            }
            society.countMembers++;
            user.user.society = society;
            user.user.batch = batch;
            logger.info(`User ${user.user.name} assigned to ${society.name} in batch ${batch}.`);
            if (society.countMembers === society.cap) {
                society.lastBatch = batch;
                // if the last user is core, assign start time immediately after the start of the batch, since anyone after them will be rejected.
                society.lastTime = user.isCore ? startTime : user.user.submit;
            }
        }
    }

    public assign_adjust() {
        this.users = this.users.sort((a, b) => {
            return b.submit.getTime() - a.submit.getTime();
        }); // make the latest submit assigned to the coldest society.

        let societiesPQ = new PriorityQueue<Society>(
            new Array(...this.societiesIdMap.values()).filter(s => s.countMembers < s.cap),
            { comparator: AssignService.society_compare }
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

    public assign() {
        this.assign_choice("first_choice");
        this.assign_choice("second_choice");
        this.assign_choice("third_choice");
        this.assign_adjust();
    }
}
