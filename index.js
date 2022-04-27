const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());
//API
app.get("/", (req, res) => {
  res.send("server is running");
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
      console.log("query", req.query);
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = productCollection.find(query);
      let products;
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
        console.log(page, size);
      } else {
        products = await cursor.limit(20).toArray();
      }

      res.send(products);
    });
    app.get("/productCount", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const count = await cursor.count();
      res.send({ count });
    });
  } finally {
  }
}
run().catch(console.dir);

// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
//   console.log("connected");
// });
