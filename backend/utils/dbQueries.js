// $match queries
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match
//1.    ?skip=0&limit=30&contentType=image&parentId=
// returning all images and folders in the root
// $match

//2.    ?skip=0&limit=30&contentType=image&parentId=100
// returning all images and folders in the folder 100
// $match

//1.    ?skip=0&limit=30&contentType=image&parentId=
// returning all images and folders in the root without paging
[
  {
    $search: {
      index: "default",
      compound: {
        must: [
          {
            text: {
              query: ["image", "folder"],
              path: "contentType",
            },
          },
        ],
        filter: [
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
];

//with paging
//https://stackoverflow.com/questions/48305624/how-to-use-mongodb-aggregation-for-pagination
// Pipeline supports only a single "$search" stage
[
  {
    $search: {
      index: "default",
      compound: {
        must: [
          {
            text: {
              query: ["image", "folder"],
              path: "contentType",
            },
          },
        ],
        filter: [
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
    $skip: 0,
  },
  {
    $limit: 2,
  },
];

{
  index: 'default',
  compound: {
    must: [
      {
        text: {
          query: ["image","folder"],
          path: "contentType"
        },
      },
      ],
      filter: [
        {
          text: {
            query: "",
            path: "parentId"
          },
        },
        ]
  }
}

//Pipeline supports only a single "$search" stage
[
  {
    $search: {
      index: "default",
      compound: {
        must: [
          {
            text: {
              query: ["image", "folder"],
              path: "contentType",
            },
          },
        ],
      },
    },
  },
  {
    $skip: 0,
  },
  {
    $limit: 2,
  },
];


//with paging


[
  {
    $search: {
      compound: {
        filter: [
          {
            range: {
              path: "year",
              gte: 2013,
              lte: 2015,
            },
          },
        ],
        should: [
          {
            text: {
              query: "snow",
              path: "title",
              score: {
                constant: {
                  value: 5,
                },
              },
            },
          },
        ],
      },
    },
  },
  {
    $limit: 10,
  },
  {
    $project: {
      _id: 0,
      title: 1,
      year: 1,
      score: {
        $meta: "searchScore",
      },
      highlights: {
        $meta: "searchHighlights",
      },
    },
  },
];






db.articles.aggregate([
  {
    $match: {
      $or: [{ contentType: "image" }, { contentType: "folder" }],
    },
  },
]);

//1. contentType=image&parentId=
dbQuery.aggregate([
  {
    $match: {
      compound: {
        filter: [
          {
            text: {
              query: ["image", "folder"],
              path: "contentType",
            },
          },
        ],
      },
    },
  },
]);

//     {$skip: 20 },
//     {$limit: 10 }

const findQuery = (queryParams) => {
  const {
    contentType = "",
    parentId = "",
    skip = "",
    limit = "",
  } = queryParams;

  const dbQuery = [
    {
      $search: {
        index: "default",
        compound: {
          must: [
            {
              text: {
                query: contentType,
                path: "contentType",
              },
            },
          ],
          filter: [
            {
              text: {
                query: parentId,
                path: "parentId",
              },
            },
          ],
        },
      },
    },
  ];

  return dbQuery;
};

const searchQueryNoFolder = (queryParams) => {
  const { contentType = "", search = "", skip = "", limit = "" } = queryParams;

  const dbQuery = [
    {
      $search: {
        index: "default",
        compound: {
          must: [
            {
              text: {
                query: search,
                path: ["name", "tags"],
              },
            },
          ],
          filter: [
            {
              text: {
                query: contentType,
                path: "contentType",
              },
            },
          ],
        },
      },
    },
    {
      $count: "total",
    },
  ];

  return dbQuery;
};

const searchQueryWithFolder = (queryParams) => {
  const {
    contentType = "",
    search = "",
    parentId = "",
    skip = "",
    limit = "",
  } = queryParams;

  const dbQuery = [
    {
      $search: {
        index: "default",
        compound: {
          must: [
            {
              text: {
                query: search,
                path: ["name", "tags"],
              },
            },
          ],
          filter: [
            {
              text: {
                query: parentId,
                path: "parentId",
              },
            },
            {
              text: {
                query: contentType,
                path: "contentType",
              },
            },
          ],
        },
        count: {
          type: "total",
        },
      },
    },
  ];

  return dbQuery;
};

//count
//https://www.mongodb.com/docs/atlas/atlas-search/counting/#std-label-fts-count-aggregation-variable

module.exports = {
  findQuery,
  searchQueryNoFolder,
  searchQueryWithFolder,
};

//how to apply paging through skip and limit
// db.Order.aggregate([
//     {$match: {company_id: ObjectId("54c0...") } },
//     {$sort: {order_number: -1 } },
//     {$setWindowFields: {output: {totalCount: {$count: {}}}}}
//     {$skip: 20 },
//     {$limit: 10 }
// ])

// db.Order.aggregate([
//     {$match: {company_id: ObjectId("54c0...") } },
//     {$sort: {order_number: -1 } },
//     {$setWindowFields: {output: {totalCount: {$count: {}}}}}
//     {$skip: 20 },
//     {$limit: 10 }
// ])

// dbOrder.aggregate([
//     { $search: { index: "default", compound: { must: [ { text: { query: search, path: ["name", "tags"], }, }, ], filter: [ { text: { query: contentType, path: "contentType", }, }, ], }, }, },
//     { $count: "total", },
//     {$sort: {priority: -1 } },
//     {$setWindowFields: {output: {count: {$count: {}}}}}
//     {$skip: 20 },
//     {$limit: 10 }
//   ]);
