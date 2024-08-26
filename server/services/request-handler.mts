import type { Request, Response, Router } from 'express';
import express from 'express';
import { PocketBaseService, type DatabaseService } from './database.mjs'
import { PocketBaseAuthorizationService, type AuthorizationService } from './authorization.mjs'

import logger from './logger.mjs';

interface InjectableRequestHandler {
    method: 'get' | 'post';
    path: string;
    new(req: Request, res: Response): {
        handle(): Promise<void>;
    };
}

class Terminate {
    public code: number;
    public reason: string;

    constructor(code: number, reason: string) {
        this.code = code;
        this.reason = reason;
    }
}

export default abstract class RequestHandler {
    static GET: 'get' = 'get';
    static POST: 'post' = 'post';

    static method: 'get' | 'post';
    static path: string;

    static inject(injectable: InjectableRequestHandler): Router {
        const router = express.Router();
        router[injectable.method](injectable.path, (req, res) => new injectable(req, res).handle());
        return router;
    }

    protected databaseService: DatabaseService;
    protected authorizationService: AuthorizationService;
    protected logger = logger;
    protected Terminate = Terminate;

    protected req: Request;
    protected res: Response;

    constructor(req: Request, res: Response) {
        this.req = req;
        this.res = res;
        const pocketBaseService = new PocketBaseService();
        this.databaseService = pocketBaseService;
        this.authorizationService = new PocketBaseAuthorizationService(pocketBaseService);
    }

    protected async authorize() {
        const authResult = await this.authorizationService.authorize(this.req.headers.authorization);
        if (!authResult.success) {
            throw new Terminate(authResult.code, authResult.error);
        }
        return authResult.authData;
    }

    protected async check_response<T>(response: Promise<T>): Promise<T> {
        try {
            return await response;
        } catch (err) {
            throw new Terminate(500, err instanceof Error ? err.message : new String(err).valueOf());
        }
      }

    protected abstract handle_core(): Promise<object | undefined>;

    public async handle(): Promise<void> {
        try {
            const result = await this.handle_core();
            if (result !== undefined) {
                this.res.json(result);
            }
        } catch (error) {
            if (error instanceof Terminate) {
                this.logger.info(`Request terminated ${error.code}: ${error.reason}`);
                this.res.status(error.code).send(error.reason);
            } else {
                this.logger.error(`Request failed: ${error}`);
                this.res.sendStatus(500);
            }
        }
    }
}
