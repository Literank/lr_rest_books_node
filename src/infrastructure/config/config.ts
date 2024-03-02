import { readFileSync } from "fs";

interface DBConfig {
  fileName: string;
  dsn: string;
  mongo_uri: string;
  mongo_db_name: string;
}

interface ApplicationConfig {
  port: number;
  page_size: number;
}

export interface CacheConfig {
  host: string;
  port: number;
  password: string;
  db: number;
  timeout: number; // in milliseconds
}

export interface Config {
  app: ApplicationConfig;
  db: DBConfig;
  cache: CacheConfig;
}

export function parseConfig(filename: string): Config {
  return JSON.parse(readFileSync(filename, "utf-8"));
}
