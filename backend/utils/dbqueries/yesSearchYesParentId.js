const yesSearchYesParentId = ({
  skip,
  limit,
  contentType,
  search,
  parentId,
}) => {
  skip = parseInt(skip);
  limit = parseInt(limit);
  return [
    {
      $search: {
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
        contentCount: {
          $sum: 1,
        },
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $sort: {
        priority: -1,
      },
    },
    {
      $set: { skip: skip, limit: limit },
    },
    {
      $project: {
        _id: 0,
        content: 1,
        contentCount: 1,
        skip: 1,
        limit: 1,
      },
    },
  ];
};

module.exports = {
  yesSearchYesParentId,
};
