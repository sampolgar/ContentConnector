// "skip":"0","limit":"30","contentType":"image"
// "skip":"0","limit":"30","contentType":"image","parentId":"01/02"
// "skip":"0","limit":"30","contentType":"image","parentId":"01"
// https://mongoosejs.com/docs/api/aggregate.html
const { Aggregate } = require("mongoose");

// Aggregate.match
//used when we need to find content in a folder
aggregate.match({
  department: {
    $in: ["sales", "engineering"],
  },
});

// search
// https://www.mongodb.com/docs/atlas/atlas-search/tutorial/
const res = await Model.aggregate().search({
  text: {
    query: "baseball",
    path: "plot",
  },
});

// handling paging
aggregate.skip(10);

// handling count
aggregate.count("userCount");

// "skip":"0","limit":"30","contentType":"image"
aggregate.match({
  contentType: {
    $in: ["image"],
  },
});

query = [
  {
    $match: {
      contentType: "image"
    }
  }
]