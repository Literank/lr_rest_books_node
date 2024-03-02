import Redis, { RedisOptions } from "ioredis";

import { CacheConfig } from "@/infrastructure/config/config";
import { CacheHelper } from "./helper";

const defaultTTL = 3600; // seconds

export class RedisCache implements CacheHelper {
  private client: Redis;

  constructor(c: CacheConfig) {
    const options: RedisOptions = {
      host: c.host,
      port: c.port,
      password: c.password,
      db: c.db,
      commandTimeout: c.timeout,
    };
    this.client = new Redis(options);
    console.log("Connected to Redis");
  }

  async save(key: string, value: string): Promise<void> {
    await this.client.set(key, value, "EX", defaultTTL);
  }

  async load(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  close(): void {
    this.client.disconnect();
  }
}
