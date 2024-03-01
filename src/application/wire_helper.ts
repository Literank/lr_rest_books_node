import { SQLitePersistence } from "@/infrastructure/database";
import { Config } from "@/infrastructure/config";
import { BookManager } from "@/domain/gateway";

// WireHelper is the helper for dependency injection
export class WireHelper {
  private persistence: SQLitePersistence;

  constructor(c: Config) {
    this.persistence = new SQLitePersistence(c.db.fileName);
  }

  bookManager(): BookManager {
    return this.persistence;
  }
}
