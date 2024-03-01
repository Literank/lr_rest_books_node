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
