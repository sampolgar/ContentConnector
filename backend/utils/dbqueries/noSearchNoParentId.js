//?skip=0&limit=30&contentType=image&parentId=

const dbQueryNoSearchNoParentId = ({ skip, limit, contentType }) => {
  skip = parseInt(skip);
  limit = parseInt(limit);

  return [
    {
      $match: {
        $or: [
          {
            contentType: contentType,
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
        total: 1,
        skip: 1,
        limit: 1,
      },
    },
  ];
};

module.exports = dbQueryNoSearchNoParentId;
