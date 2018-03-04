const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String],
  createAt: {
        type:Date,
        default: Date.now
  }
});

PostSchema.statics.write = function({title, body, tags}){
      const post = new this({
            title,
            body,
            tags
      });
      return post.save();
}

global.Post = global.Post || mongoose.model('Post', PostSchema);
module.exports = global.Post;