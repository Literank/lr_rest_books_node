import express, { Request, Response } from "express";
import morgan from "morgan";

import { Book } from "@/domain/model";
import { BookOperator, ReviewOperator } from "@/application/executor";
import { WireHelper } from "@/application";

class RestHandler {
  private bookOperator: BookOperator;
  private reviewOperator: ReviewOperator;

  constructor(bookOperator: BookOperator, reviewOperator: ReviewOperator) {
    this.bookOperator = bookOperator;
    this.reviewOperator = reviewOperator;
  }

  // Get all books
  public async getBooks(req: Request, res: Response): Promise<void> {
    let offset = parseInt(req.query.o as string);
    if (isNaN(offset)) {
      offset = 0;
    }
    try {
      const books = await this.bookOperator.getBooks(
        offset,
        req.query.q as string
      );
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

  // Get all book reviews
  public async getReviewsOfBook(req: Request, res: Response): Promise<void> {
    const bookID = parseInt(req.params.id, 10);
    if (isNaN(bookID)) {
      res.status(400).json({ error: "invalid book id" });
      return;
    }

    try {
      const books = await this.reviewOperator.getReviewsOfBook(bookID);
      res.status(200).json(books);
    } catch (err) {
      console.error(`Failed to get reviews of book ${bookID}: ${err}`);
      res.status(404).json({ error: "failed to get books" });
    }
  }

  // Get single review
  public async getReview(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
      const review = await this.reviewOperator.getReview(id);
      res.status(200).json(review);
    } catch (err) {
      console.error(`Failed to get the review ${id}: ${err}`);
      res.status(404).json({ error: "failed to get the review" });
    }
  }

  // Create a new review
  public async createReview(req: Request, res: Response): Promise<void> {
    const reviewBody = req.body;

    try {
      const review = await this.reviewOperator.createReview(reviewBody);
      res.status(201).json(review);
    } catch (err) {
      console.error(`Failed to create: ${err}`);
      res.status(404).json({ error: "failed to create the review" });
    }
  }

  // Update an existing review
  public async updateReview(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    const reqBody = req.body;

    try {
      const book = await this.reviewOperator.updateReview(id, reqBody);
      res.status(200).json(book);
    } catch (err) {
      console.error(`Failed to update: ${err}`);
      res.status(404).json({ error: "failed to update the review" });
    }
  }

  // Delete an existing review
  public async deleteReview(req: Request, res: Response): Promise<void> {
    const id = req.params.id;

    try {
      await this.reviewOperator.deleteReview(id);
      res.status(204).send();
    } catch (err) {
      console.error(`Failed to delete: ${err}`);
      res.status(404).json({ error: "failed to delete the review" });
    }
  }
}

// Create router
function MakeRouter(wireHelper: WireHelper): express.Router {
  const restHandler = new RestHandler(
    new BookOperator(wireHelper.bookManager(), wireHelper.cacheHelper()),
    new ReviewOperator(wireHelper.reviewManager())
  );

  const router = express.Router();

  router.get("/books", restHandler.getBooks.bind(restHandler));
  router.get("/books/:id", restHandler.getBook.bind(restHandler));
  router.post("/books", restHandler.createBook.bind(restHandler));
  router.put("/books/:id", restHandler.updateBook.bind(restHandler));
  router.delete("/books/:id", restHandler.deleteBook.bind(restHandler));
  router.get(
    "/books/:id/reviews",
    restHandler.getReviewsOfBook.bind(restHandler)
  );
  router.get("/reviews/:id", restHandler.getReview.bind(restHandler));
  router.post("/reviews", restHandler.createReview.bind(restHandler));
  router.put("/reviews/:id", restHandler.updateReview.bind(restHandler));
  router.delete("/reviews/:id", restHandler.deleteReview.bind(restHandler));

  return router;
}

export function InitApp(wireHelper: WireHelper): express.Express {
  const app = express();

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Use Morgan middleware with predefined tokens
  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
    )
  );

  // Define a health endpoint handler
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  const r = MakeRouter(wireHelper);
  app.use("", r);
  return app;
}
