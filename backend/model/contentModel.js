const mongoose = require("mongoose");

const contentSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
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
  previewUrl: {
    type: String,
  },
  downloadUrl: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
  },
});

module.exports = mongoose.model("Content", contentSchema);