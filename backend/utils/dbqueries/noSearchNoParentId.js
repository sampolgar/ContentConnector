//?skip=0&limit=30&contentType=image&parentId=

//get all content from the lowest parentid
const noSearchNoParentId = ({ skip, limit, contentType }) => {
  skip = parseInt(skip);
  limit = parseInt(limit);

  return [
    {
      $match: {
        contentType: contentType,
      },
    },
    {
      $group: {
        _id: "$parentId",
        minParentId: { $min: "$parentId" },
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

// get the lowest parentId
// this is only needed if there is a folder hierarchy
const getParentIdQueryNoSearchNoParentId = ({ contentType }) => {
  return [
    {
      $match: {
        contentType: "folder",
        fileType: contentType,
      },
    },
    {
      $group: {
        _id: "$parentId",
        minParentId: { $min: "$parentId" },
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
      },
    },
    {
      $project: {
        _id: 0,
        minParentId: "$minParentId",
      },
    },
  ];
};

module.exports = {
  noSearchNoParentId,
  getParentIdQueryNoSearchNoParentId,
};
