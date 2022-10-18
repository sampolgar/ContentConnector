const mongoose = require("mongoose");

const contentSchema = mongoose.Schema({
  id: {
    type: String,
  },
  parentId: {
    type: String,
  },
  fileFolderName: {
    type: String,
  },
  mimeType: {
    type: String,
    required: true,
    enum: [
      "application/vnd.templafy.folder",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
  },
  mimeType: {
    type: String,
  },
  previewUrl: {
    type: String,
  },
  downloadUrl: {
    type: String,
  },
  name: {
    type: String,
  },
  tags: {
    type: String,
  },
});

module.exports = mongoose.model("Content", contentSchema);
