import type { CreateUserInner, CreateSocietyInner } from '../../types/types.js';
import { PocketBaseService } from '../services/database.mjs';
import { PocketBaseAuthorizationService } from '../services/authorization.mjs';
import { readFileSync } from 'node:fs';
import 'dotenv/config';

const databaseService = new PocketBaseService();
const authorizationService = new PocketBaseAuthorizationService(databaseService);

const adminData = {
    email: process.env['admin_email'],
    password: process.env['admin_password'],
};
if (!adminData.email || !adminData.password) {
    throw new Error('Admin data not set.');
}

await authorizationService.auth_admin(adminData.email, adminData.password);

const students: Array<any> = JSON.parse(readFileSync('./server/script/students.json', 'utf-8'));
const societies: Array<any> = JSON.parse(readFileSync('./server/script/societies.json', 'utf-8'));

async function try_create_user(data: CreateUserInner) {
    try {
        console.log(data);
        await databaseService.create_user(data);
    } catch (e) {
        console.log(`${data}`, e);
    }
}

async function try_create_society(data: CreateSocietyInner) {
    try {
        console.log(data);
        await databaseService.create_society(data);
    } catch (e) {
        console.log(`Society ${data.name} already exists.`)
    }
}


await Promise.all(students.map(async (student: any) => {
    await try_create_user({
        "username": student.no,
        "password": student.password,
        "name": student.name,
        "class": student.className,
        "role": "student" as const,
    });
}));

await Promise.all(societies.map(async (society: any) => {
    const limit = society.limit === "/" ? undefined : society.limit as string;
    const question = society.question === "/" ? undefined : society.question as string;
    await try_create_society({
        name: society.name,
        cap: society.cap,
        description: society.description,
        limit,
        teacher: society.teacher,
        question,
    });
}));
