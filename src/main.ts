import { WireHelper } from "@/application";
import { InitApp } from "@/adapter/router";

const port = process.env.PORT || 3000;

const c = {
  app: {
    port: Number(port),
  },
  db: {
    fileName: "test.db",
  },
};
const wireHelper = new WireHelper(c);
const app = InitApp(wireHelper);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
