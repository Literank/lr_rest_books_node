import { Config } from "@/infrastructure/config";
import {
  BookManager,
  PermissionManager,
  ReviewManager,
  UserManager,
} from "@/domain/gateway";
import { MySQLPersistence, MongoPersistence } from "@/infrastructure/database";
import { RedisCache, CacheHelper } from "@/infrastructure/cache";
import { TokenKeeper } from "@/infrastructure/token";

// WireHelper is the helper for dependency injection
export class WireHelper {
  private sql_persistence: MySQLPersistence;
  private no_sql_persistence: MongoPersistence;
  private kv_store: RedisCache;
  private tokenKeeper: TokenKeeper;

  constructor(c: Config) {
    this.sql_persistence = new MySQLPersistence(c.db.dsn, c.app.page_size);
    this.no_sql_persistence = new MongoPersistence(
      c.db.mongo_uri,
      c.db.mongo_db_name
    );
    this.kv_store = new RedisCache(c.cache);
    this.tokenKeeper = new TokenKeeper(c.app.token_secret, c.app.token_hours);
  }

  bookManager(): BookManager {
    return this.sql_persistence;
  }

  permManager(): PermissionManager {
    return this.tokenKeeper;
  }

  userManager(): UserManager {
    return this.sql_persistence;
  }

  reviewManager(): ReviewManager {
    return this.no_sql_persistence;
  }

  cacheHelper(): CacheHelper {
    return this.kv_store;
  }
}
