import express, { Request, Response } from "express";
import { Book } from "./model/book";

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/ping", (req: Request, res: Response) => {
  res.json({ message: "pong" });
});

let booksDB: Book[] = []; // Temporary storage for books

// GET all books
app.get("/books", (req: Request, res: Response) => {
  res.json(booksDB);
});

// GET a single book by ID
app.get("/books/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const book = booksDB.find((book) => book.id === id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// POST a new book
app.post("/books", (req: Request, res: Response) => {
  const newBook: Book = req.body;
  newBook.id = booksDB.length + 1; // demo only, ignore the latent bug
  const now = new Date();
  newBook.created_at = now;
  newBook.updated_at = now;
  booksDB.push(newBook);
  res.status(201).json(newBook);
});

// PUT (update) an existing book by ID
app.put("/books/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedBook: Book = req.body;
  const index = booksDB.findIndex((book) => book.id === id);
  if (index !== -1) {
    booksDB[index] = { ...booksDB[index], ...updatedBook };
    res.json(booksDB[index]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// DELETE a book by ID
app.delete("/books/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = booksDB.findIndex((book) => book.id === id);
  if (index !== -1) {
    booksDB.splice(index, 1);
    res.sendStatus(204);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
