import { Book } from "@/domain/model";

export interface BookManager {
  createBook(b: Book): Promise<number>;
  updateBook(id: number, b: Book): Promise<void>;
  deleteBook(id: number): Promise<void>;
  getBook(id: number): Promise<Book | null>;
  getBooks(offset: number, keyword: string): Promise<Book[]>;
}
