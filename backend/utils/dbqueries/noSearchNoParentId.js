//?skip=0&limit=30&contentType=image&parentId=

//get all content from the lowest parentid
const makeQueryNoSearchNoParentId = ({ skip, limit, contentType }) => {
  console.log("here1");
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
            fileType: contentType,
          },
        ],
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
const getParentIdQueryNoSearchNoParentId = ({ contentType }) => {
  console.log("here2");
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
  makeQueryNoSearchNoParentId,
  getParentIdQueryNoSearchNoParentId,
};
