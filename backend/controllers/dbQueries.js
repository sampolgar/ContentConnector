// const findQuery = (queryParams) => {
//   const { contentType = "", parentId = "" } = queryParams;

//   const dbQuery = {
//     $or: [
//       { $and: [{ contentType: contentType }, { parentId: parentId }] },
//       { $and: [{ contentType: "folder" }, { parentId: parentId }] },
//     ],
//   };

//   return dbQuery;
// };

const findQuery = (queryParams) => {
  const { contentType = "", parentId = "" } = queryParams;

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
  const { contentType = "", search = "" } = queryParams;

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
  const { contentType = "", search = "", parentId = "" } = queryParams;

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
