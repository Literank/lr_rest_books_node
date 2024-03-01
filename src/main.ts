import { WireHelper } from "@/application";
import { InitApp } from "@/adapter/router";

const port = process.env.PORT || 3000;

const c = {
  app: {
    port: Number(port),
  },
  db: {
    fileName: "test.db",
    dsn: "mysql://test_user:test_pass@127.0.0.1:3306/lr_book?charset=utf8mb4",
  },
};
const wireHelper = new WireHelper(c);
const app = InitApp(wireHelper);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
