// Book represents the structure of a book
export interface Book {
  id: number;
  title: string;
  author: string;
  published_at: string;
  description: string;
  isbn: string;
  total_pages: number;
  created_at: Date;
  updated_at: Date;
}
