import Cap from '@cap.js/server';
import type { DatabaseService } from './database.mjs';
import logger from './logger.mjs';

export class CapService {
  private cap: Cap;
  private databaseService: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.databaseService = databaseService;
    this.cap = new Cap({
      storage: {
        challenges: {
          store: async (token: string, challengeData: any) => {
            await this.storeChallenge(token, challengeData);
          },
          read: async (token: string) => {
            return await this.readChallenge(token);
          },
          delete: async (token: string) => {
            await this.deleteChallenge(token);
          },
          listExpired: async () => {
            return await this.listExpiredChallenges();
          },
        },
        tokens: {
          store: async (tokenKey: string, expires: number) => {
            await this.storeToken(tokenKey, expires);
          },
          get: async (tokenKey: string) => {
            return await this.getToken(tokenKey);
          },
          delete: async (tokenKey: string) => {
            await this.deleteToken(tokenKey);
          },
          listExpired: async () => {
            return await this.listExpiredTokens();
          },
        },
      },
    });
  }

  // 存储挑战
  private async storeChallenge(token: string, challengeData: any): Promise<void> {
    try {
      const expires = new Date(challengeData.expires);
      const data = JSON.stringify(challengeData);

      await this.databaseService.create_challenge({
        token,
        data,
        expires: expires.toISOString(),
      });
    } catch (error) {
      logger.error(`Failed to store CAP challenge: ${error}`);
      throw error;
    }
  }

  // 读取挑战
  private async readChallenge(token: string): Promise<{ challenge: any; expires: number } | null> {
    try {
      const record = await this.databaseService.get_challenge(token);

      // 检查是否过期
      if (record && new Date(record.expires) > new Date()) {
        return {
          challenge: JSON.parse(record.data),
          expires: new Date(record.expires).getTime(),
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // 删除挑战
  private async deleteChallenge(token: string): Promise<void> {
    try {
      const record = await this.databaseService.get_challenge(token);
      if (record) {
        await this.databaseService.delete_challenge(record.id);
      }
    } catch (error) {
      // 挑战可能不存在，忽略错误
    }
  }

  // 列出过期挑战
  private async listExpiredChallenges(): Promise<string[]> {
    try {
      return await this.databaseService.list_expired_challenges();
    } catch (error) {
      logger.error(`Failed to list expired CAP challenges: ${error}`);
      return [];
    }
  }

  // 存储令牌
  private async storeToken(tokenKey: string, expires: number): Promise<void> {
    try {
      await this.databaseService.create_token({
        token: tokenKey,
        expired: new Date(expires).toISOString()
      });
    } catch (error) {
      logger.error(`Failed to store CAP token: ${error}`);
      throw error;
    }
  }

  // 获取令牌
  private async getToken(tokenKey: string): Promise<number | null> {
    try {
      const record = await this.databaseService.get_token(tokenKey);
      if (record) {
        return new Date(record.expired).getTime();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // 删除令牌
  private async deleteToken(tokenKey: string): Promise<void> {
    try {
      await this.databaseService.delete_token(tokenKey);
    } catch (error) {
      logger.debug(`Failed to delete CAP token (may not exist): ${tokenKey}`);
    }
  }

  // 列出过期令牌
  private async listExpiredTokens(): Promise<string[]> {
    try {
      return await this.databaseService.list_expired_tokens();
    } catch (error) {
      logger.error(`Failed to list expired CAP tokens: ${error}`);
      return [];
    }
  }

  // 创建挑战
  public async createChallenge() {
    return await this.cap.createChallenge();
  }

  // 兑换挑战
  public async redeemChallenge(token: string, solutions: any) {
    return await this.cap.redeemChallenge({ token, solutions });
  }

  // 验证令牌
  public async validateToken(token: string): Promise<{ success: boolean }> {
    return await this.cap.validateToken(token);
  }

  // 清理过期数据
  public async cleanup() {
    await this.cap.cleanup();
  }
}
