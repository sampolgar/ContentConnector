//find the images and folders with no parentId
{
  $or: [
    { $and: [{ contentType: "image" }, { parentId: "" }] },
    { $and: [{ contentType: "folder" }, { parentId: "" }] },
  ];
}

//find the images and folders with parentId = "103"
{
  $or: [
    { $and: [{ contentType: "image" }, { parentId: "103" }] },
    { $and: [{ contentType: "folder" }, { parentId: "103" }] },
  ];
}

//find the images with Burgundy in the name or tags
[
  {
    $search: {
      index: "default",
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
        ],
      },
    },
  },
];

///  //find the images with Burgundy in the name or tags within the parentId = "103"
[
  {
    $search: {
      index: "default",
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
              query: "103",
              path: "parentId",
            },
          },
          {
            text: {
              query: "image",
              path: "contentType",
            },
          },
        ],
      },
    },
  },
];

[
  {
    $search: {
      index: "default",
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
              query: "103",
              path: "parentId",
            },
          },
          {
            text: {
              query: "image",
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