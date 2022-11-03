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

module.exports = {
  findQuery,
  searchQueryNoFolder,
  searchQueryWithFolder,
};