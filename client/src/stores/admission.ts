import { defineStore } from 'pinia';
import { Fetcher } from '@/lib/fetch.js';
import { batch_to_number, batch_to_string } from '@/lib/utils.js';
import { computed, reactive } from 'vue';
import type { AdmittedSociety, AdmittedUser, AdmissionResult } from '../../../types/types.d.ts';
import { useErrorStore } from './error.js';

export type DefaultItem = Record<string, any> & { id: string }

export interface TableData<I extends DefaultItem = DefaultItem> {
    heads: { [K in keyof I]?: string };
    rows: I[];
}

interface ItemUser {
    id: string;
    class: string;
    name: string;
    society: string;
    submit: string;
    choicesStr: string;
}

interface ItemSociety {
    id: string;
    name: string;
    cap: number;
    countMembers: number;
    sourcesAdmitStr: string;
    choicesStr: string;
    lastBatch: string;
    lastTime: number | null;
}

interface ItemReview {
    id: string;
    name: string;
    batch: string;
    submit: string;
    admittedSociety: string;
    answer: string;
    canReject: boolean;
    isRejected: boolean;
}

interface ItemResultSociety {
    id: string;
    no: number;
    class: string;
    name: string;
}

interface ItemResultClass {
    id: string;
    number: string;
    name: string;
    society: string;
}

export const useAdmissionStore = defineStore('admission', () => {

    const users = reactive<AdmittedUser[]>([]);
    const societies = reactive<AdmittedSociety[]>([]);

    const classes = computed(() => {
        return new Set<string>(users.map(user => user.class));
    });

    const tableUsers = computed<TableData<ItemUser>>(() => {
        const rows = users.sort((a, b) => a.submit - b.submit).map(user => {
            const submitDisplay = (user.submit / 1000).toFixed(3)
            return {
                id: user.id,
                class: user.class,
                name: user.name,
                society: user.society?.name ?? "未录取",
                submit: submitDisplay,
                choicesStr: [0, 1, 2].map(i => user.choices?.[i]?.name ?? "未选择").join(", "),
            }
        });
        return {
            heads: {
                'class': '班级',
                'name': '姓名',
                'society': '录取社团',
                'submit': '选课时间',
                'choicesStr': '选课志愿',
            },
            rows,
        }
    });

    const tableSocieties = computed<TableData<ItemSociety>>(() => {
        const rows = societies.sort((a, b) => {
            if (a.lastBatch !== b.lastBatch) {
                return batch_to_number(a.lastBatch) - batch_to_number(b.lastBatch);
            }
            if (a.lastTime !== b.lastTime) {
                return (a.lastTime ?? 1e20) - (b.lastTime ?? 1e20);
            }
            return b.countMembers - a.countMembers;
        }).map(society => {
            const choicesApplicant = [0, 1, 2].map(index => users.filter(user => user.choices[index]?.name === society.name).length);
            const choicesAdmit = [0, 1, 2].map(index => users.filter(user => user.choices[index]?.name === society.name && user.society?.name === society.name).length);
            const choicesAdmitSum = choicesAdmit.reduce((acc, val) => acc + val, 0);

            return {
                id: society.id,
                name: society.name,
                cap: society.cap,
                countMembers: society.countMembers,
                sourcesAdmitStr: [
                    society.coreMembers.length,
                    ...choicesAdmit,
                    society.countMembers - society.coreMembers.length - choicesAdmitSum,
                ].map(n => n.toString()).join("+"),
                choicesStr: choicesApplicant.map(n => n.toString()).join("+"),
                lastBatch: batch_to_string(society.lastBatch),
                lastTime: society.lastTime,
            }
        });

        return {
            heads: {
                'name': '社团名称',
                'cap': '限额',
                'countMembers': '实录人数',
                'sourcesAdmitStr': '各批次录取人数',
                'choicesStr': '各批次报名人数',
                'lastBatch': '志愿线',
                'lastTime': '时间线',
            },
            rows,
        }
    });

    function getTableReview(societyName: string): TableData<ItemReview> {
        const heads = {
            'name': '姓名',
            'batch': '报名批次',
            'submit': '提交时间',
            'admittedSociety': '拟录取社团',
            'answer': '回答',
        }
        const society = societies.find(society => society.name === societyName);
        if (society === undefined) {
            return { heads, rows: [] };
        }
        const rows = users.filter(user => {
            if (!user.society) {
                return false;
            }
            if (user.society.id === society.id) {
                return true;
            }
            if (user.rejects.some(reject => reject.id === society.id)) {
                return true; // should be given another chance
            }
            if (user.choices.some(choice => choice.id === society.id)) {
                // If a user could have been admitted to the society, but was placed later, they should be given a second chance.
                const batch_diff = batch_to_number(user.batch) - batch_to_number(society.lastBatch);
                if (batch_diff !== 0) {
                    return batch_diff > 0;
                } else {
                    return society.lastTime && user.submit > society.lastTime;
                }
            }
        }).sort((a, b) => {
            if (a.batch !== b.batch) {
                return batch_to_number(a.batch) - batch_to_number(b.batch);
            }
            return a.submit - b.submit;
        }).map(student => {
            const choiceBatch = student.batch === 'core' ? batch_to_string(student.batch) : batch_to_string(
                student.choices[0]?.id === society.id ? 0 : (
                    student.choices[1]?.id === society.id ? 1 : (
                        student.choices[2]?.id === society.id ? 2 : 'adjust'
                    )
                )
            );
            return {
                id: student.id,
                name: student.name,
                batch: choiceBatch,
                submit: student.submit.toFixed(3),
                admittedSociety: student.society?.name ?? "未录取",
                answer: student.answer ?? "/",
                canReject: student.batch !== 'adjust' && student.batch !== 'core',
                isRejected: student.rejects.some(_society => society.id === _society.id),
            }
        });
        return { heads, rows };
    };

    function getTableResultSocieties(societyName: string): TableData<ItemResultSociety> {
        const society = societies.find(society => society.name === societyName);
        const heads = {
            'no': '序号',
            'class': '班级',
            'name': '姓名',
        };
        if (!society) {
            return { heads, rows: [] };
        }

        const rows = users.filter(user => user.society?.id === society.id).sort((a, b) => {
            return parseInt(a.number) - parseInt(b.number);
        }).map((user, i) => {
            return {
                no: i + 1,
                id: user.id,
                class: user.class,
                name: user.name,
            };
        });
        return { heads, rows };
    }

    function getTableResultClasses(className: string): TableData<ItemResultClass> {
        const _users = users
            .filter(user => user.class === className)
            .sort((a, b) => parseInt(a.number) - parseInt(b.number))
            .map(user => {
                return {
                    id: user.id,
                    number: user.number,
                    name: user.name,
                    society: user.society?.name ?? "未录取",
                };
            });
        return { heads: { 'number': '学号', 'name': '姓名', 'society': '录取社团' }, rows: _users };
    }

    function toggle_reject(userID: string, society: AdmittedSociety | undefined): void {
        const errorStore = useErrorStore();
        const user = users.find(user => user.id == userID);
        if (!society) {
            errorStore.add_error(`拟更改退档状态的用户所在社团不存在。`);
            return;
        }
        if (!user) {
            errorStore.add_error(`拟更改退档状态的用户 (ID: ${userID}) 不存在`);
            return;
        }
        const targetReject = !user.rejects.some(reject => reject.id == society.id);
        new Fetcher<void>({
            url: `/api/review/toggle?reject`,
            method: "POST",
            data: JSON.stringify({
                reject: targetReject,
                userID: user.id,
                societyID: society.id,
            })
        }).fetch_json().then(() => {
            if (targetReject) {
                user.rejects.push(society);
            } else {
                user.rejects.splice(user.rejects.findIndex(reject => reject.id == society.id), 1)
            }
        });
    }

    function fetchAdmissionResult(): void {
        new Fetcher<AdmissionResult>({
            url: '/api/review/dashboard',
            method: 'GET',
        }).fetch_json().then(data => {
            users.splice(0, users.length, ...data.users);
            societies.splice(0, societies.length, ...data.societies);
        })
    }


    return {
        users,
        societies,
        classes,
        tableUsers,
        tableSocieties,
        getTableReview,
        getTableResultSocieties,
        getTableResultClasses,
        fetchAdmissionResult,
        toggle_reject,
    };
});
