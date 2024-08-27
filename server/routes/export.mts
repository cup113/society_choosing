import express from 'express';
import XLSX from 'xlsx';
import { execSync } from 'child_process';
import { PriorityQueue } from 'priority-queue-typed';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import type { User as RawUser, Choice } from '../../types/types.d.ts';

import RequestHandler from '../services/request-handler.mjs';

interface Society {
  name: string;
  cap: number;
  countMembers: number;
}

interface User {
  number: string;
  name: string;
  class: string;
  society: Society | null;
  first_choice: Society | null;
  second_choice: Society | null;
  third_choice: Society | null;
  submit: Date;
}

class ExportHandler extends RequestHandler {
  static method = RequestHandler.POST;
  static path = "/choosing";

  private async get_society_map(): Promise<Map<string, Society>> {
    const societies = await this.check_response(this.databaseService.list_all_societies());
    return new Map(societies.map(s => [s.id, {
      name: s.name,
      cap: s.cap,
      countMembers: 0,
    }]));
  }

  private get_sorted_users(usersRaw: RawUser[], choosingRaw: Choice[], societiesMap: Map<string, Society>): User[] {
    return usersRaw.filter(user => user.role === "student").map(user => {
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
        number: user.username.slice(3),
        class: user.class,
        society: null,
        first_choice,
        second_choice,
        third_choice,
        // if not chosen, let the submit time be the latest.
        submit: new Date(choosingData?.created ?? Date.now()),
      };
    }).sort((a, b) => {
      return a.submit.getTime() - b.submit.getTime();
    });
  }

  private export_xlsx_societies(mapSocieties: Map<string, User[]>, folder: string) {
    const workbook = XLSX.utils.book_new();
    for (const [name, users] of mapSocieties.entries()) {
      const worksheet = XLSX.utils.json_to_sheet(users.map((user, i) => {
        return {
          "序号": i + 1,
          "姓名": user.name,
          "班级": user.class,
        };
      }));
      XLSX.utils.book_append_sheet(workbook, worksheet, name);
    }
    XLSX.writeFile(workbook, `${folder}/按社团分.xlsx`);
  }

  private export_xlsx_classes(mapClasses: Map<string, User[]>, folder: string) {
    const workbook = XLSX.utils.book_new();
    for (const [name, users] of mapClasses.entries()) {
      const worksheet = XLSX.utils.json_to_sheet(users.sort((a, b) => a.number.localeCompare(b.number)).map(user => {
        return {
          "学号": user.number,
          "姓名": user.name,
          "社团": user.society?.name ?? "未选择",
        };
      }));
      XLSX.utils.book_append_sheet(workbook, worksheet, name)
    }
    XLSX.writeFile(workbook, `${folder}/按班级分.xlsx`);
  }

  public async handle_core(): Promise<object | undefined> {
    await this.authorize();
    const choosingRaw = await this.check_response(this.databaseService.list_choices());
    const usersRaw = await this.check_response(this.databaseService.list_users());
    const societiesMap = await this.get_society_map();
    let users: User[] = this.get_sorted_users(usersRaw, choosingRaw, societiesMap);

    const mapSocieties = new Map<string, User[]>();
    const mapClasses = new Map<string, User[]>();

    for (const society of societiesMap.values()) {
      mapSocieties.set(society.name, []);
    }

    for (const user of users) {
      if (mapClasses.get(user.class) === undefined) {
        mapClasses.set(user.class, []);
      }
      mapClasses.get(user.class)!.push(user);
    }

    for (const key of ["first_choice", "second_choice", "third_choice"] as const) {
      for (const user of users) {
        if (user.society !== null) {
          continue;
        }
        const society = user[key];
        if (society === null) {
          continue;
        }
        if (society.countMembers >= society.cap) {
          continue;
        }
        society.countMembers++;
        user.society = society;
        mapSocieties.get(society.name)!.push(user);
      }
    }

    // adjust
    users = users.reverse();
    let societiesPQ = new PriorityQueue<Society>(
      new Array(...societiesMap.values()).filter(s => s.countMembers < s.cap),
      {
        comparator: (a: Society, b: Society) => a.countMembers / a.cap - b.countMembers / b.cap
      }
    );
    while (true) {
      const firstUser = users.find(user => user.society === null);
      const society = societiesPQ.poll();
      if (firstUser === undefined || society === undefined) {
        break;
      }
      firstUser.society = society;
      mapSocieties.get(society.name)!.push(firstUser);
      society.countMembers++;
      if (society.countMembers < society.cap) {
        societiesPQ.add(society);
      }
    }

    const timestamp = Date.now();
    const folder = `./instances/exports/${timestamp}`
    mkdirSync(folder, { recursive: true });

    this.export_xlsx_societies(mapSocieties, folder);
    this.export_xlsx_classes(mapClasses, folder);

    execSync(`7z a ${folder}/导出数据.zip ${folder}/按社团分.xlsx ${folder}/按班级分.xlsx`);

    this.res.sendFile(join(process.cwd(), `${folder}/导出数据.zip`));
    return;
  }
}

export default RequestHandler.inject(ExportHandler);
