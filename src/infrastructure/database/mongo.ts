import {
  MongoClient,
  Db,
  Collection,
  ObjectId,
  Filter,
  Document,
} from "mongodb";
import { Review } from "@/domain/model";
import { ReviewManager } from "@/domain/gateway";

const coll_review = "reviews";

export class MongoPersistence implements ReviewManager {
  private db!: Db;
  private coll!: Collection;

  constructor(mongoURI: string, dbName: string) {
    const client = new MongoClient(mongoURI);
    client.connect().then(() => {
      this.db = client.db(dbName);
      this.coll = this.db.collection(coll_review);
      console.log("Connected to mongodb.");
    });
  }

  async createReview(r: Review): Promise<string> {
    const result = await this.coll.insertOne(r);
    return result.insertedId.toHexString();
  }

  async updateReview(id: string, r: Review): Promise<void> {
    const objID = new ObjectId(id);
    const updateValues = {
      title: r.title,
      content: r.content,
      updated_at: r.updated_at,
    };
    const result = await this.coll.updateOne(
      { _id: objID },
      { $set: updateValues }
    );
    if (result.modifiedCount === 0) {
      throw new Error("Review does not exist");
    }
  }

  async deleteReview(id: string): Promise<void> {
    const objID = new ObjectId(id);
    const result = await this.coll.deleteOne({ _id: objID });
    if (result.deletedCount === 0) {
      throw new Error("Review does not exist");
    }
  }

  async getReview(id: string): Promise<Review | null> {
    const objID = new ObjectId(id);
    const reviewDoc = await this.coll.findOne({ _id: objID });
    if (!reviewDoc) {
      return null;
    }
    return {
      id: reviewDoc._id.toHexString(),
      book_id: reviewDoc.book_id,
      author: reviewDoc.author,
      title: reviewDoc.title,
      content: reviewDoc.content,
      created_at: reviewDoc.created_at,
      updated_at: reviewDoc.updated_at,
    };
  }

  async getReviewsOfBook(book_id: number, keyword: string): Promise<Review[]> {
    const filter: Filter<Document> = { book_id };
    if (keyword) {
      filter.$or = [
        { title: { $regex: keyword, $options: "i" } }, // Case-insensitive regex search for title
        { content: { $regex: keyword, $options: "i" } }, // Case-insensitive regex search for content
      ];
    }
    const cursor = this.coll.find(filter);
    const reviewDocs = await cursor.toArray();
    return reviewDocs.map((reviewDoc) => ({
      id: reviewDoc._id.toHexString(),
      book_id: reviewDoc.book_id,
      author: reviewDoc.author,
      title: reviewDoc.title,
      content: reviewDoc.content,
      created_at: reviewDoc.created_at,
      updated_at: reviewDoc.updated_at,
    }));
  }
}
