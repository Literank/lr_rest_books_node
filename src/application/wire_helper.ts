import { MySQLPersistence } from "@/infrastructure/database";
import { Config } from "@/infrastructure/config";
import { BookManager } from "@/domain/gateway";

// WireHelper is the helper for dependency injection
export class WireHelper {
  private persistence: MySQLPersistence;

  constructor(c: Config) {
    this.persistence = new MySQLPersistence(c.db.dsn);
  }

  bookManager(): BookManager {
    return this.persistence;
  }
}
