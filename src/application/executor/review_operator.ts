import { ReviewManager } from "@/domain/gateway";
import { Review } from "@/domain/model";
import { ReviewBody } from "@/application/dto";

export class ReviewOperator {
  private reviewManager: ReviewManager;

  constructor(b: ReviewManager) {
    this.reviewManager = b;
  }

  async createReview(rb: ReviewBody): Promise<Review> {
    const now = new Date();
    const r: Review = {
      ...rb,
      created_at: now,
      updated_at: now,
      id: "",
    };
    const id = await this.reviewManager.createReview(r);
    r.id = id;
    return r;
  }

  async getReview(id: string): Promise<Review | null> {
    return await this.reviewManager.getReview(id);
  }

  async getReviewsOfBook(book_id: number, query: string): Promise<Review[]> {
    return await this.reviewManager.getReviewsOfBook(book_id, query);
  }

  async updateReview(id: string, r: Review): Promise<Review> {
    await this.reviewManager.updateReview(id, r);
    return r;
  }

  async deleteReview(id: string): Promise<void> {
    await this.reviewManager.deleteReview(id);
  }
}
