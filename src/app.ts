import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";

import { Book } from "./model/book";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Database connection
let db: sqlite3.Database;

function initDB() {
  db = new sqlite3.Database("./test.db", (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to the database.");
      db.exec(
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

initDB();

app.get("/ping", (req: Request, res: Response) => {
  res.json({ message: "pong" });
});

// GET all books
app.get("/books", (req: Request, res: Response) => {
  db.all("SELECT * FROM books", (err, rows) => {
    if (err) {
      console.error("Error getting books:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

// GET a single book by ID
app.get("/books/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Error getting book:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (row) {
      res.json(row);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });
});

// POST a new book
app.post("/books", (req: Request, res: Response) => {
  const newBook: Book = req.body;
  const { title, author, published_at, description, isbn, total_pages } =
    newBook;
  db.run(
    `INSERT INTO books (title, author, published_at, description, isbn, total_pages) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, author, published_at, description, isbn, total_pages],
    function (err) {
      if (err) {
        console.error("Error creating book:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        newBook.id = this.lastID;
        res.status(201).json(newBook);
      }
    }
  );
});

// PUT (update) an existing book by ID
app.put("/books/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedBook: Book = req.body;
  const { title, author, published_at, description, isbn, total_pages } =
    updatedBook;
  db.run(
    `UPDATE books SET title = ?, author = ?, published_at = ?, description = ?, isbn = ?, total_pages = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [title, author, published_at, description, isbn, total_pages, id],
    (err) => {
      if (err) {
        console.error("Error updating book:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(updatedBook);
      }
    }
  );
});

// DELETE a book by ID
app.delete("/books/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  db.run("DELETE FROM books WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting book:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.sendStatus(204); // Send 204 status (No Content)
    }
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
