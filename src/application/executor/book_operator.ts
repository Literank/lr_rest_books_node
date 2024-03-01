import { BookManager } from "@/domain/gateway";
import { Book } from "@/domain/model";

export class BookOperator {
  private bookManager: BookManager;

  constructor(b: BookManager) {
    this.bookManager = b;
  }

  async createBook(b: Book): Promise<Book> {
    const id = await this.bookManager.createBook(b);
    b.id = id;
    return b;
  }

  async getBook(id: number): Promise<Book | null> {
    return await this.bookManager.getBook(id);
  }

  async getBooks(): Promise<Book[]> {
    return await this.bookManager.getBooks();
  }

  async updateBook(id: number, b: Book): Promise<Book> {
    await this.bookManager.updateBook(id, b);
    return b;
  }

  async deleteBook(id: number): Promise<void> {
    await this.bookManager.deleteBook(id);
  }
}
