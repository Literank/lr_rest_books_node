interface DBConfig {
  fileName: string;
}

interface ApplicationConfig {
  port: number;
}

export interface Config {
  app: ApplicationConfig;
  db: DBConfig;
}
