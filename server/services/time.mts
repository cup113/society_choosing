import type { DatabaseService } from './database.mjs'
import dayjs from 'dayjs';
import type { TimeStatus } from '../../types/types.d.ts';

export default class TimeService {
    public db: DatabaseService;

    constructor(db: DatabaseService) {
        this.db = db;
    }

    public async get_time_status(): Promise<TimeStatus> {
        const { start, end } = await this.db.get_date("society20250907");
        const now = dayjs();
        const eta = dayjs(start).diff(now);
        const endEta = dayjs(end).diff(now);

        if (eta > 0) {
            // event hasn't started yet
            return {
                open: false,
                reason: 'not-started',
                eta,
                endEta,
            };
        }

        if (endEta < 0) {
            // event has ended
            return {
                open: false,
                reason: 'ended',
            }
        }

        return {
            open: true,
            endEta,
        }
    }

    public async get_start_time(): Promise<string> {
        return (await this.db.get_date("society_2024_09")).start;
    }
}
