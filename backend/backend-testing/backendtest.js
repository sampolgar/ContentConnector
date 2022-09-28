const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const agg = [
  {
    '$search': {
      'phrase': {
        'path': ["name", "tags"],
        'query': 'food',
        'slop': 5
      },
    }
  }, {
    '$limit': 5
  },
];

MongoClient.connect(
    process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (connectErr, client) {
    assert.equal(null, connectErr);
    const coll = client.db("test").collection("contents");
    let cursor = await coll.aggregate(agg);
    await cursor.forEach((doc) => console.log(doc));
    client.close();
  }
);
