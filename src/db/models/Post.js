const mongoose = require('mongoose');
const { Schema } = mongoose;
const {
      LIST_SIZE
} = process.env;

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

PostSchema.statics.getList = function({tag, page}){
      return this
            .find(tag ? {tags: tag} : {})
            .sort({"createAt": -1})
            .skip((page-1)*LIST_SIZE)
            .limit(LIST_SIZE)
            .lean()
            .exec();
}

global.Post = global.Post || mongoose.model('Post', PostSchema);
module.exports = global.Post;