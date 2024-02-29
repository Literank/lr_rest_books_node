import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/ping", (req: Request, res: Response) => {
  res.json({ message: "pong" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
