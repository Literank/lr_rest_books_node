import { MySQLPersistence, MongoPersistence } from "@/infrastructure/database";
import { Config } from "@/infrastructure/config";
import { BookManager, ReviewManager } from "@/domain/gateway";

// WireHelper is the helper for dependency injection
export class WireHelper {
  private sql_persistence: MySQLPersistence;
  private no_sql_persistence: MongoPersistence;

  constructor(c: Config) {
    this.sql_persistence = new MySQLPersistence(c.db.dsn);
    this.no_sql_persistence = new MongoPersistence(
      c.db.mongo_uri,
      c.db.mongo_db_name
    );
  }

  bookManager(): BookManager {
    return this.sql_persistence;
  }

  reviewManager(): ReviewManager {
    return this.no_sql_persistence;
  }
}
