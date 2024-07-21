import express from 'express';
import get_pb from '../src/database.mjs';
import XLSX from 'xlsx';
import { execSync } from 'child_process';
import { join } from 'node:path';
import logger from '../src/logger.mjs';

const router = express.Router();

interface Society {
    name: string;
    cap: number;
    countMembers: number;
}

interface User {
    waiting: boolean;
    name: string;
    classNo: string;
    society: Society | null;
    first_choice: Society | null;
    second_choice: Society | null;
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
        if (chosen) {
            first_choice = societiesMap.get(choosingData.first_choice)!;
            second_choice = societiesMap.get(choosingData.second_choice)!;
        }

        return {
            waiting: true,
            name: user.name,
            classNo: user.class,
            society: null,
            first_choice,
            second_choice,
            submit: new Date(choosingData?.created ?? 0),
        };
    }).sort((a, b) => {
        return a.submit.getTime() - b.submit.getTime();
    });

    const mapSocieties = new Map<string, User[]>([["未选择", []]]);
    const mapClasses = new Map<string, User[]>();

    for (const society of societiesMap.values()) {
        mapSocieties.set(society.name, []);
    }

    for (const user of users) {
        mapClasses.set(user.classNo, []);
    }

    // TODO adjust
    for (const key of ["first_choice", "second_choice"] as ('first_choice' | 'second_choice')[]) {
        for (const user of users) {
            if (!user.waiting) {
                continue;
            }
            const society = user[key];
            if (society !== null && society.countMembers >= society.cap) {
                continue;
            }
            mapSocieties.get(society?.name ?? "未选择")!.push(user);
            if (society !== null) {
                society.countMembers++;
            }
            user.society = society;
            mapClasses.get(user.classNo)!.push(user);
            user.waiting = false;
        }
    }
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
        XLSX.writeFile(workbook, "instances/exports/按社团分.xlsx");
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
        XLSX.writeFile(workbook, "instances/exports/按班级分.xlsx");
    }
    // TODO make xlsx top-level
    execSync("7z a instances/exports/导出数据.zip instances/exports/按社团分.xlsx instances/exports/按班级分.xlsx");

    res.sendFile(join(process.cwd(), "instances/exports/导出数据.zip"));
});

export default router;
