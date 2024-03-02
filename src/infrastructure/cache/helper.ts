export interface CacheHelper {
  save(key: string, value: string): Promise<void>;
  load(key: string): Promise<string | null>;
}
