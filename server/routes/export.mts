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
  answer?: string;
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
      let answer: string | undefined = undefined;
      if (chosen) {
        first_choice = societiesMap.get(choosingData.first_choice)!;
        second_choice = societiesMap.get(choosingData.second_choice)!;
        third_choice = societiesMap.get(choosingData.third_choice)!;
        answer = choosingData.answer;
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
        answer,
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

  private export_summary(societiesMap: Map<string, Society>, mapSocieties: Map<string, User[]>, folder: string) {
    const workbook = XLSX.utils.book_new();
    const usersData = new Array<{
      "班级": string;
      "姓名": string;
      "学号": string;
      "第一志愿": string;
      "第二志愿": string;
      "第三志愿": string;
      "录取批次": "第一志愿" | "第二志愿" | "第三志愿" | "调剂" | "未录取",
      "录取社团": string,
      "附加问题答案": string,
      "提交时间": Date,
    }>();
    const societyHeatMap = new Map(
    [...societiesMap.entries()].map(([_, society]) => {
      return [society.name, {
        "社团名称": society.name,
        "限额": society.cap,
        "录取人数": society.countMembers,
        "总报名人数": 0,
        "第一志愿报名人数": 0,
        "第二志愿报名人数": 0,
        "第三志愿报名人数": 0,
        "第一志愿录取人数": 0,
        "第二志愿录取人数": 0,
        "第三志愿录取人数": 0,
        "调剂人数": 0,
      }];
    }));

    [...mapSocieties.values()].flat().forEach(user => {
      const society = user.society;
      const batch = society === null ? "未录取" : (society === user.first_choice ? "第一志愿" : (society === user.second_choice ? "第二志愿" : (society === user.third_choice ? "第三志愿" : "调剂")));
      const first_choice = user.first_choice?.name ?? "未选择";
      const second_choice = user.second_choice?.name ?? "未选择";
      const third_choice = user.third_choice?.name ?? "未选择";

      usersData.push({
        "班级": user.class,
        "姓名": user.name,
        "学号": user.number,
        "第一志愿": first_choice,
        "第二志愿": second_choice,
        "第三志愿": third_choice,
        "录取批次": batch,
        "录取社团": society?.name ?? "未录取",
        "附加问题答案": user.answer ?? "/",
        "提交时间": user.submit,
      });

      if (society?.name) {
        const finalSociety = societyHeatMap.get(society.name);
        if (!finalSociety) {
          return;
        }
        finalSociety["总报名人数"]++;
        finalSociety[batch === "第一志愿" ? "第一志愿录取人数" : (batch === "第二志愿" ? "第二志愿录取人数" : (batch === "第三志愿" ? "第三志愿录取人数" : "调剂人数"))]++;

        ([["第一志愿报名人数", first_choice], ["第二志愿报名人数", second_choice], ["第三志愿报名人数", third_choice]] as const).forEach(([batchKey, society]) => {
          if (society === "未选择") {
            return;
          }

          const finalSociety = societyHeatMap.get(society)!;
          finalSociety[batchKey]++;
          finalSociety["总报名人数"]++;
        });
      }
    });

    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(usersData), "学生原始数据");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(Array.from(societyHeatMap.values())), "社团热度数据");
    XLSX.writeFile(workbook, `${folder}/导出汇总.xlsx`);
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
    this.export_summary(societiesMap, mapSocieties, folder);

    execSync(`7z a ${folder}/导出数据.zip ${folder}/按社团分.xlsx ${folder}/按班级分.xlsx ${folder}/导出汇总.xlsx`);

    this.res.sendFile(join(process.cwd(), `${folder}/导出数据.zip`));
    return;
  }
}

export default RequestHandler.inject(ExportHandler);
