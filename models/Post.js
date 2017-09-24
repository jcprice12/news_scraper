// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create Post schema
var PostSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true,
    unique: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  summary: {
      type: String,
      required: true,
  },
  image: {
      type: String,
      required: true,
  },
  interesting: {
    type: Boolean,
    required: true,
    default: false
  },
  // This only saves one note's ObjectId, ref refers to the Comment model
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment",
  }]
});

// Create the Post model with the PostSchema
var Post = mongoose.model("Post", PostSchema);

// Export the model
module.exports = Post;