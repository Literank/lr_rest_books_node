import sqlite3 from "sqlite3";

import { Book } from "@/domain/model/book";
import { BookManager } from "@/domain/gateway/book_manager";

export class SQLitePersistence implements BookManager {
  private db: sqlite3.Database;

  constructor(dbFilePath: string) {
    this.db = new sqlite3.Database(dbFilePath, (err) => {
      if (err) {
        console.error("Error opening database:", err.message);
      } else {
        console.log("Connected to the database.");
        this.db.exec(
          `CREATE TABLE IF NOT EXISTS books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                published_at TEXT NOT NULL,
                description TEXT NOT NULL,
                isbn TEXT NOT NULL,
                total_pages INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
              )`,
          (err) => {
            if (err) {
              console.error("Error opening database:", err.message);
            } else {
              console.log("Successfully initialized tables.");
            }
          }
        );
      }
    });
  }

  async createBook(b: Book): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const { title, author, published_at, description, isbn, total_pages } = b;
      this.db.run(
        `INSERT INTO books (title, author, published_at, description, isbn, total_pages) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, author, published_at, description, isbn, total_pages],
        function (err) {
          if (err) {
            console.error("Error creating book:", err.message);
            reject(err);
          } else {
            resolve(this.lastID);
          }
        }
      );
    });
  }

  async updateBook(id: number, b: Book): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const { title, author, published_at, description, isbn, total_pages } = b;
      this.db.run(
        `UPDATE books SET title = ?, author = ?, published_at = ?, description = ?, isbn = ?, total_pages = ? WHERE id = ?`,
        [title, author, published_at, description, isbn, total_pages, id],
        (err) => {
          if (err) {
            console.error("Error updating book:", err.message);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async deleteBook(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.run("DELETE FROM books WHERE id = ?", [id], (err) => {
        if (err) {
          console.error("Error deleting book:", err.message);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async getBook(id: number): Promise<Book | null> {
    return new Promise<Book | null>((resolve, reject) => {
      this.db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
        if (err) {
          console.error("Error getting book:", err.message);
          reject(err);
        } else if (row) {
          resolve(row as Book);
        } else {
          resolve(null);
        }
      });
    });
  }

  async getBooks(): Promise<Book[]> {
    return new Promise<Book[]>((resolve, reject) => {
      this.db.all("SELECT * FROM books", (err, rows) => {
        if (err) {
          console.error("Error getting books:", err.message);
          reject(err);
        } else {
          resolve(rows as Book[]);
        }
      });
    });
  }

  close(): void {
    this.db.close();
  }
}
