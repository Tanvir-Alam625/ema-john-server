const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());
//API
app.get("/", (req, res) => {
  res.send(" jma john server is running");
});
app.listen(port, () => {
  console.log("port is running", port);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.be5rp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("emaJohnDB").collection("products");

    app.get("/product", async (req, res) => {
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = productCollection.find(query);
      let products;
      if (page) {
        products = await cursor
          .skip(page * 10)
          .limit(10)
          .toArray();
      } else {
        products = await cursor.limit(20).toArray();
      }

      res.send(products);
    });
    // count product
    app.get("/productCount", async (req, res) => {
      const count = await productCollection.estimatedDocumentCount();
      res.send({ count });
    });
    // get product ids
    app.post("/productKeys", async (req, res) => {
      const keys = req.body;
      const ids = keys.map((id) => ObjectId(id));
      const query = { _id: { $in: ids } };
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);

      console.log(keys);
    });
  } finally {
  }
}
run().catch(console.dir);
