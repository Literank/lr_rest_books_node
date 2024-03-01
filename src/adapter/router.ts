import express, { Request, Response } from "express";

import { Book } from "@/domain/model";
import { BookOperator } from "@/application/executor";
import { WireHelper } from "@/application";

class RestHandler {
  private bookOperator: BookOperator;

  constructor(bookOperator: BookOperator) {
    this.bookOperator = bookOperator;
  }

  // Get all books
  public async getBooks(req: Request, res: Response): Promise<void> {
    try {
      const books = await this.bookOperator.getBooks();
      res.status(200).json(books);
    } catch (err) {
      console.error(`Failed to get books: ${err}`);
      res.status(404).json({ error: "Failed to get books" });
    }
  }

  // Get single book
  public async getBook(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(404).json({ error: "Invalid id" });
      return;
    }
    try {
      const book = await this.bookOperator.getBook(id);
      res.status(200).json(book);
    } catch (err) {
      console.error(`Failed to get the book with ${id}: ${err}`);
      res.status(404).json({ error: "Failed to get the book" });
    }
  }

  // Create a new book
  public async createBook(req: Request, res: Response): Promise<void> {
    try {
      const book = await this.bookOperator.createBook(req.body as Book);
      res.status(201).json(book);
    } catch (err) {
      console.error(`Failed to create: ${err}`);
      res.status(404).json({ error: "Failed to create" });
    }
  }

  // Update an existing book
  public async updateBook(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(404).json({ error: "Invalid id" });
      return;
    }
    try {
      const book = await this.bookOperator.updateBook(id, req.body as Book);
      res.status(200).json(book);
    } catch (err) {
      console.error(`Failed to update: ${err}`);
      res.status(404).json({ error: "Failed to update" });
    }
  }

  // Delete an existing book
  public async deleteBook(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(404).json({ error: "Invalid id" });
      return;
    }
    try {
      await this.bookOperator.deleteBook(id);
      res.status(204).end();
    } catch (err) {
      console.error(`Failed to delete: ${err}`);
      res.status(404).json({ error: "Failed to delete" });
    }
  }
}

// Create router
function MakeRouter(wireHelper: WireHelper): express.Router {
  const restHandler = new RestHandler(
    new BookOperator(wireHelper.bookManager())
  );

  const router = express.Router();

  router.get("", restHandler.getBooks.bind(restHandler));
  router.get("/:id", restHandler.getBook.bind(restHandler));
  router.post("", restHandler.createBook.bind(restHandler));
  router.put("/:id", restHandler.updateBook.bind(restHandler));
  router.delete("/:id", restHandler.deleteBook.bind(restHandler));

  return router;
}

export function InitApp(wireHelper: WireHelper): express.Express {
  const app = express();

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Define a health endpoint handler
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  const r = MakeRouter(wireHelper);
  app.use("/books", r);
  return app;
}
