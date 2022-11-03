const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

const skipper = 0;
const limiter = 30;

//?skip=0&limit=30&contentType=image&parentId=
//query 1
const agg = [
  {
    $match: {
      $or: [
        {
          contentType: "image",
        },
        {
          contentType: "folder",
        },
      ],
    },
  },
  {
    $group: {
      _id: null,
      content: {
        $push: {
          id: "$id",
          mimeType: "$mimeType",
          name: "$name",
          previewUrl: "$previewUrl",
          tags: "$tags",
        },
      },
      total: {
        $sum: 1,
      },
    },
  },
  {
    $skip: skipper,
  },
  {
    $limit: limiter,
  },
  {
    $sort: {
      priority: -1,
    },
  },
  {
    $set: { skip: skipper, limit: limiter },
  },
  {
    $project: {
      _id: 0,
      content: 1,
      total: 1,
      skip: 1,
      limit: 1,
    },
  },
];

const agg2 = [
  {
    $match: {
      $or: [
        {
          contentType: "image",
          parentId: "103",
        },
        {
          contentType: "folder",
          parentId: "103",
        },
      ],
    },
  },
  {
    $group: {
      _id: null,
      content: {
        $push: {
          id: "$id",
          mimeType: "$mimeType",
          name: "$name",
          previewUrl: "$previewUrl",
          tags: "$tags",
        },
      },
      total: {
        $sum: 1,
      },
    },
  },
  {
    $skip: 0,
  },
  {
    $limit: 30,
  },
  {
    $sort: {
      priority: -1,
    },
  },
  {
    $project: {
      _id: 0,
      content: 1,
      total: 1,
    },
  },
];

const agg3 = [
  {
    $search: {
      compound: {
        must: [
          {
            text: {
              query: "wine",
              path: ["name", "tags"],
            },
          },
        ],
        filter: [
          {
            text: {
              query: "folder",
              path: "contentType",
            },
          },
        ],
      },
    },
  },
  {
    $group: {
      _id: null,
      content: {
        $push: {
          id: "$id",
          mimeType: "$mimeType",
          name: "$name",
          previewUrl: "$previewUrl",
          tags: "$tags",
        },
      },
      total: {
        $sum: 1,
      },
    },
  },
  {
    $skip: 0,
  },
  {
    $limit: 30,
  },
  {
    $project: {
      _id: 0,
      content: 1,
      total: 1,
    },
  },
];

//5.    ?skip=0&limit=30&contentType=image&parentId=100&search=cat
//find images in parentId 103 with cat in the name or tags

const agg4 = [
  {
    $search: {
      compound: {
        must: [
          {
            text: {
              query: "Burgundy",
              path: ["name", "tags"],
            },
          },
        ],
        filter: [
          {
            text: {
              query: "image",
              path: "contentType",
            },
          },
          {
            text: {
              query: "103",
              path: "parentId",
            },
          },
        ],
      },
    },
  },
  {
    $group: {
      _id: null,
      content: {
        $push: {
          id: "$id",
          mimeType: "$mimeType",
          name: "$name",
          previewUrl: "$previewUrl",
          tags: "$tags",
        },
      },
      total: {
        $sum: 1,
      },
    },
  },
  {
    $skip: 0,
  },
  {
    $limit: 30,
  },
  {
    $project: {
      _id: 0,
      content: 1,
      total: 1,
    },
  },
];

//make the query
MongoClient.connect(
  Process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async function (connectErr, client) {
    assert.equal(null, connectErr);
    const coll = client.db("contentconnector").collection("content");
    let cursor = await coll.aggregate(agg);
    await cursor.forEach((doc) => console.log(doc));
    client.close();
  }
);
