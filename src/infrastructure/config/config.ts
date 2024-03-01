import { readFileSync } from "fs";

interface DBConfig {
  fileName: string;
  dsn: string;
}

interface ApplicationConfig {
  port: number;
}

export interface Config {
  app: ApplicationConfig;
  db: DBConfig;
}

export function parseConfig(filename: string): Config {
  return JSON.parse(readFileSync(filename, "utf-8"));
}
