import { Review } from "@/domain/model";

export interface ReviewManager {
  createReview(r: Review): Promise<string>;
  updateReview(id: string, r: Review): Promise<void>;
  deleteReview(id: string): Promise<void>;
  getReview(id: string): Promise<Review | null>;
  getReviewsOfBook(book_id: number): Promise<Review[]>;
}
