const mongoose = require('mongoose');
const { Schema } = mongoose;
const {
      LIST_SIZE
} = process.env;

const SIZE = parseInt(LIST_SIZE);

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

PostSchema.statics.getList = function({page, tag}){
      return this
            .find(tag ? {tags: tag} : {})
            .sort({"createAt": -1})
            .skip((page-1)*SIZE)
            .limit(SIZE)
            .lean()
            .exec();
}

PostSchema.statics.getLastPage = function(tag){
      return this.count(tag ? {tags: tag} : {}).exec() ;
}

PostSchema.statics.editPost = function({id, title, body, tags}){
      return this.findOneAndUpdate(
            {_id : id},
            {title,body,tags}
      ).exec();
}

PostSchema.statics.deletePost = function(id){
      return this.remove({
            _id: id
      }).exec();
}

global.Post = global.Post || mongoose.model('Post', PostSchema);
module.exports = global.Post;