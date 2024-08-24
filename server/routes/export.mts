import express from 'express';
import XLSX from 'xlsx';
import { execSync } from 'child_process';
import { PriorityQueue } from 'priority-queue-typed';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

import get_pb from '../src/database.mjs';
import logger from '../src/logger.mjs';

const router = express.Router();

interface Society {
    name: string;
    cap: number;
    countMembers: number;
}

interface User {
    name: string;
    classNo: string;
    society: Society | null;
    first_choice: Society | null;
    second_choice: Society | null;
    third_choice: Society | null;
    submit: Date;
}

router.post('/choosing', async function (req, res) {
    logger.info(`Received exporting choosing data request from ${req.ip}: ${req.body.token}`);

    const pb = get_pb();
    pb.authStore.save(req.body.token);
    if (!pb.authStore.isValid) {
        res.status(401).json({ error: "Invalid token" });
        return;
    }
    pb.collection('users').authRefresh();

    const choosingRaw = (await pb.collection('choosing_24B').getFullList());
    const usersRaw = await pb.collection('users').getFullList();
    const societiesMap = new Map((await pb.collection('societies').getFullList()).map(s => [s.id, {
        name: s.name,
        cap: s.cap,
        countMembers: 0,
    } as Society]));

    const users: User[] = usersRaw.filter(user => user.role === "student").map(user => {
        const choosingData = choosingRaw.findLast(data => data.user === user.id);
        const chosen = choosingData !== undefined;

        let first_choice = null as Society | null;
        let second_choice = null as Society | null;
        let third_choice = null as Society | null;
        if (chosen) {
            first_choice = societiesMap.get(choosingData.first_choice)!;
            second_choice = societiesMap.get(choosingData.second_choice)!;
            third_choice = societiesMap.get(choosingData.third_choice)!;
        }

        return {
            waiting: true,
            name: user.name,
            classNo: user.class,
            society: null,
            first_choice,
            second_choice,
            third_choice,
            submit: new Date(choosingData?.created ?? 0),
        };
    }).sort((a, b) => {
        return a.submit.getTime() - b.submit.getTime();
    });

    const mapSocieties = new Map<string, User[]>();
    const mapClasses = new Map<string, User[]>();

    for (const society of societiesMap.values()) {
        mapSocieties.set(society.name, []);
    }

    for (const user of users) {
        mapClasses.set(user.classNo, []);
    }

    for (const key of ["first_choice", "second_choice", "third_choice"] as const) {
        for (const user of users) {
            if (user.society !== null) {
                continue;
            }
            const society = user[key];
            if (society !== null && society.countMembers >= society.cap) {
                continue;
            }
            if (society === null) {
                continue;
            }
            mapSocieties.get(society.name)!.push(user);
            if (society !== null) {
                society.countMembers++;
            }
            user.society = society;
            mapClasses.get(user.classNo)!.push(user);
        }
    }

    // adjust
    let societiesPQ = new PriorityQueue<Society>(
        new Array(...societiesMap.values()).filter(s => s.countMembers < s.cap),
        {
            comparator: (a: Society, b: Society) => a.countMembers / a.cap - b.countMembers / b.cap
        }
    );
    for (const society of societiesPQ) {
        const firstUser = users.find(user => user.society === null);
        if (firstUser === undefined) {
            break;
        }
        firstUser.society = society;
        society.countMembers++;
        if (society.countMembers < society.cap) {
            societiesPQ.add(society);
        }
    }

    const timestamp = Date.now();
    const folder = `./instances/exports/${timestamp}`
    mkdirSync(folder, { recursive: true });

    {
        const workbook = XLSX.utils.book_new();
        for (const [name, users] of mapSocieties.entries()) {
            const worksheet = XLSX.utils.json_to_sheet(users.map((user, i) => {
                return {
                    "序号": i + 1,
                    "姓名": user.name,
                    "班级": user.classNo,
                };
            }));
            XLSX.utils.book_append_sheet(workbook, worksheet, name);
        }
        XLSX.writeFile(workbook, `${folder}/按社团分.xlsx`);
    }
    {
        const workbook = XLSX.utils.book_new();
        for (const [name, users] of mapClasses.entries()) {
            const worksheet = XLSX.utils.json_to_sheet(users.map(user => {
                return {
                    "姓名": user.name,
                    "社团": user.society?.name ?? "未选择",
                };
            }));
            XLSX.utils.book_append_sheet(workbook, worksheet, name)
        }
        XLSX.writeFile(workbook, `${folder}/按班级分.xlsx`);
    }

    execSync(`7z a ${folder}/导出数据.zip ${folder}/按社团分.xlsx ${folder}/按班级分.xlsx`);

    res.sendFile(join(process.cwd(), `${folder}/导出数据.zip`));
});

export default router;
