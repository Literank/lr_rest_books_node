import mysql, { ResultSetHeader, RowDataPacket } from "mysql2";

import { Book } from "@/domain/model/book";
import { BookManager } from "@/domain/gateway/book_manager";

export class MySQLPersistence implements BookManager {
  private db: mysql.Connection;

  constructor(dsn: string) {
    this.db = mysql.createConnection(dsn);
    this.db.addListener("error", (err) => {
      console.error("Error connecting to MySQL:", err.message);
    });

    this.db.execute(
      `CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        published_at VARCHAR(15) NOT NULL,
        description TEXT NOT NULL,
        isbn VARCHAR(255) NOT NULL,
        total_pages INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`,
      (err) => {
        if (err) {
          console.error("Error in MySQL:", err.message);
        } else {
          console.log("Successfully initialized tables.");
        }
      }
    );
  }

  async createBook(b: Book): Promise<number> {
    const { title, author, published_at, description, isbn, total_pages } = b;
    const [result] = await this.db
      .promise()
      .query(
        "INSERT INTO books (title, author, published_at, description, isbn, total_pages) VALUES (?, ?, ?, ?, ?, ?)",
        [title, author, published_at, description, isbn, total_pages]
      );
    return (result as ResultSetHeader).insertId;
  }

  async updateBook(id: number, b: Book): Promise<void> {
    const { title, author, published_at, description, isbn, total_pages } = b;
    await this.db
      .promise()
      .query(
        "UPDATE books SET title = ?, author = ?, published_at = ?, description = ?, isbn = ?, total_pages = ? WHERE id = ?",
        [title, author, published_at, description, isbn, total_pages, id]
      );
  }

  async deleteBook(id: number): Promise<void> {
    await this.db.promise().query("DELETE FROM books WHERE id = ?", [id]);
  }

  async getBook(id: number): Promise<Book | null> {
    let [rows] = await this.db
      .promise()
      .query("SELECT * FROM books WHERE id = ?", [id]);
    rows = rows as RowDataPacket[];
    return rows.length ? (rows[0] as Book) : null;
  }

  async getBooks(): Promise<Book[]> {
    const [rows] = await this.db.promise().query("SELECT * FROM books");
    return rows as Book[];
  }

  close(): void {
    this.db.end();
  }
}
