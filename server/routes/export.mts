import XLSX from 'xlsx';
import { execSync } from 'child_process';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import type { Request, Response } from 'express';
import dayjs from 'dayjs';

import RequestHandler from '../services/request-handler.mjs';
import AssignService from '../services/assign.mjs';
import { CodeType } from '../../types/codes.js';
import TimeService from '../services/time.mjs';

interface SummaryUserData {
  "班级": string;
  "姓名": string;
  "学号": string;
  "第一志愿": string;
  "第二志愿": string;
  "第三志愿": string;
  "录取批次": "第一志愿" | "第二志愿" | "第三志愿" | "调剂" | "未录取",
  "录取社团": string,
  "附加问题答案": string,
  "提交时间": number,
}

interface SocietyUserData {
  "序号": number,
  "姓名": string,
  "班级": string,
  "录取批次": string,
}

interface ClassUserData {
  "学号": string,
  "姓名": string,
  "社团": string,
}

class ExportHandler extends RequestHandler {
  static method = RequestHandler.POST;
  static path = "/choosing";

  static BATCH_RECORD = {
    "first_choice": "第一志愿",
    "second_choice": "第二志愿",
    "third_choice": "第三志愿",
    "adjust": "调剂",
    "not_accepted": "未录取",
    "not_full": "未满",
  } as const;

  public folder: string;
  public assignService: AssignService | undefined;
  public startTime: dayjs.Dayjs | undefined;

  constructor(req: Request, res: Response) {
    super(req, res);
    const timestamp = Date.now();
    this.folder = `./instances/exports/${timestamp}`
    mkdirSync(this.folder, { recursive: true });
  }

  private export_xlsx_societies() {
    if (this.assignService === undefined) {
      throw new this.Terminate(CodeType.InternalError, "AssignService uninitialized")
    }
    const workbook = XLSX.utils.book_new();
    const data = new Map([...this.assignService.societiesIdMap.values()].map(society => [society.name, new Array<SocietyUserData>()]))
    data.set("未分配", []);
    this.assignService.users.forEach(user => {
      const students = data.get(user.society?.name ?? "未分配")!;
      students.push({
        "序号": students.length + 1,
        "姓名": user.name,
        "班级": user.class,
        "录取批次": ExportHandler.BATCH_RECORD[user.batch ?? "not_accepted"],
      });
    });
    new Array(...data.entries()).forEach(([name, users]) => {
      const worksheet = XLSX.utils.json_to_sheet(users);
      XLSX.utils.book_append_sheet(workbook, worksheet, name)
    });
    return workbook;
  }

  private export_xlsx_classes() {
    if (this.assignService === undefined) {
      throw new this.Terminate(CodeType.InternalError, "AssignService uninitialized")
    }
    const workbook = XLSX.utils.book_new();
    const data = new Map<string, Array<ClassUserData>>();
    this.assignService.users.forEach(user => data.set(user.class, []));
    this.assignService.users.forEach(user => {
      data.get(user.class)!.push({
        "学号": user.number,
        "姓名": user.name,
        "社团": user.society?.name ?? "未分配",
      });
    });
    new Array(...data.entries()).sort((a, b) => a[0].localeCompare(b[0])).forEach(([name, users]) => {
      const worksheet = XLSX.utils.json_to_sheet(users.sort((a, b) => a["学号"].localeCompare(b["学号"])));
      XLSX.utils.book_append_sheet(workbook, worksheet, name)
    });

    return workbook;
  }

  private export_summary() {
    if (this.assignService === undefined) {
      throw new this.Terminate(CodeType.InternalError, "AssignService uninitialized")
    }
    const workbook = XLSX.utils.book_new();
    const usersData = new Array<SummaryUserData>();
    const societySummary = new Map(
      [...this.assignService.societiesIdMap.entries()].map(([_, society]) => {
        const lastTime = society.lastTime;
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
          "批次线": ExportHandler.BATCH_RECORD[society.lastBatch ?? "not_full"],
          "时间线": lastTime ? lastTime.diff(this.startTime, 's', true) : null,
        }];
      }));

    this.assignService.users.forEach(user => {
      const society = user.society;
      const batch = ExportHandler.BATCH_RECORD[user.batch ?? "not_accepted"];

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
        "提交时间": user.submit.diff(this.startTime, 's', true),
      });

      if (society?.name) {
        const finalSociety = societySummary.get(society.name);
        if (!finalSociety) {
          return;
        }
        finalSociety[({
          "first_choice": "第一志愿录取人数",
          "second_choice": "第二志愿录取人数",
          "third_choice": "第三志愿录取人数",
          "adjust": "调剂人数",
        } as const)[user.batch!]]++;

        ([["第一志愿报名人数", first_choice], ["第二志愿报名人数", second_choice], ["第三志愿报名人数", third_choice]] as const).forEach(([batchKey, society]) => {
          if (society === "未选择") {
            return;
          }

          const finalSociety = societySummary.get(society)!;
          finalSociety[batchKey]++;
          finalSociety["总报名人数"]++;
        });
      }
    });

    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(usersData), "学生原始数据");
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(Array.from(societySummary.values())), "社团热度数据");
    return workbook;
  }

  public async handle_core(): Promise<object | undefined> {
    await this.authorize();
    await this.databaseService.delete_duplicated_choices();
    const usersRaw = await this.check_response(this.databaseService.list_users());
    const societiesRaw = await this.check_response(this.databaseService.list_all_societies());
    const choosingRaw = await this.check_response(this.databaseService.list_choices());

    this.startTime = dayjs(await new TimeService(this.databaseService).get_start_time());
    this.assignService = new AssignService(usersRaw, societiesRaw, choosingRaw, this.startTime);
    this.assignService.assign();

    const workbooks = [
      ["按社团分", this.export_xlsx_societies()],
      ["按班级分", this.export_xlsx_classes()],
      ["导出汇总", this.export_summary()],
    ] as const;

    workbooks.forEach(([name, workbook]) => {
      XLSX.writeFile(workbook, join(this.folder, `${name}.xlsx`));
    });
    const paths = workbooks.map(([name, _]) => `${this.folder}/${name}.xlsx`).join(" ");
    const exportPath = join(this.folder, "导出数据.zip");

    execSync(`7z a ${exportPath} ${paths}`);

    this.res.sendFile(exportPath, { root: "." });
    return;
  }
}

export default RequestHandler.inject(ExportHandler);
