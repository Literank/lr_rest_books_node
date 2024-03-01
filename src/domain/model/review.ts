// Review represents the review of a book
export interface Review {
  id: string;
  book_id: number;
  author: string;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}
