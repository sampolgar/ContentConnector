//Scratchboard for queries, need to convert to readme

// // "skip":"0","limit":"30","contentType":"image"
// // "skip":"0","limit":"30","contentType":"image","parentId":"01/02"
// // "skip":"0","limit":"30","contentType":"image","parentId":"01"
// // https://mongoosejs.com/docs/api/aggregate.html
// //https://www.digitalocean.com/community/tutorials/how-to-create-queries-in-mongodb

// // contentType (string): Will specify what type of content is being requested. Possible values are image / textElement / slide / slideElement / pdf / emailElement
// // limit (integer): Limits the amount of items to return
// // skip (integer): Skip the first x items, used for paging
// // parentId (string, optional): Id of the parent of which to show content
// // search (string, optional): Content to search for, contains the users search string

// // returns everything
// const content = await Content.find();

// const content = await Content.find({
//   contentType: "image",
// });

// //find images in a folder 103 (and all subfolders)
// const content = await Content.find({
//   $or: [{ contentType: "image", parentId: "103" }, { parentId: "103" }],
// });

// //search for images in the base-level

// //paging
// const contentCount = await Content.find({
//   $or: [{ contentType: "image", parentId: "103" }, { parentId: "103" }],
// }).limit(3);

// //full text search
// const content = await Content.find({
//   $text: { $search: "*Burgundy*" },
// });

// //search images in a folder
// const content = await Content.find({
//   $and: [{ parentId: "103" }, { contentType: "image" }],
//   $or: [{parentId: "103"}],
//   $text: { $search: "*Burgundy*" },
// });

// //using skip and limit
// const content = await Content.find({
//   $and: [{ parentId: "103" }, { contentType: "image" }],
//   $text: { $search: "*Burgundy*" },
// })
//   .skip(7)
//   .limit(3);
// res.status(200).json(content);

// // skip":"0","limit":"30"
// //skip":"30","limit":"30"
// // searchHandler
//   const content = await Content.find({
//     $and: [{ parentId: "103" }, { contentType: "image" }],
//     $text: { $search: "*Burgundy*" },
//   })
//     .skip(7)
//     .limit(3);
//   res.status(200).json(content);

//   // findHandler
//     const content = await Content.find({{ parentId: "103" }, { contentType: "image" },
//     })
//       .skip(7)
//       .limit(3);
//     res.status(200).json(content);

//     let dbQuery = {};
//     dbQuery.
//     dbQuery.$text = {$search: "*Burgundy*"}

//     dbQuery.parentId = query.parentId.slice(-3);

//     // contentCount (integer): Total number of results
//     // offset (integer): Current offset

//   const content = await Content.find({
//     $and: [{ contentType: "image" }],
//   })
//     .skip(7)
//     .limit(3);
//   res.status(200).json(content);