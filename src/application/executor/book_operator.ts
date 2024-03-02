import { BookManager } from "@/domain/gateway";
import { Book } from "@/domain/model";
import { CacheHelper } from "@/infrastructure/cache";

const booksKey = "lr-books";

export class BookOperator {
  private bookManager: BookManager;
  private cacheHelper: CacheHelper;

  constructor(b: BookManager, c: CacheHelper) {
    this.bookManager = b;
    this.cacheHelper = c;
  }

  async createBook(b: Book): Promise<Book> {
    const id = await this.bookManager.createBook(b);
    b.id = id;
    return b;
  }

  async getBook(id: number): Promise<Book | null> {
    return await this.bookManager.getBook(id);
  }

  async getBooks(offset: number, query: string): Promise<Book[]> {
    // Search results, don't cache it
    if (query) {
      return await this.bookManager.getBooks(offset, query);
    }
    // Normal list of results
    const k = `${booksKey}-${offset}`;
    const cache_value = await this.cacheHelper.load(k);
    if (cache_value) {
      return JSON.parse(cache_value);
    }
    const books = await this.bookManager.getBooks(offset, "");
    await this.cacheHelper.save(k, JSON.stringify(books));
    return books;
  }

  async updateBook(id: number, b: Book): Promise<Book> {
    await this.bookManager.updateBook(id, b);
    return b;
  }

  async deleteBook(id: number): Promise<void> {
    await this.bookManager.deleteBook(id);
  }
}
