const createResponse = require('../lib/response');
const connect = require('../db');
const Post = require('../db/models/Post');

module.exports.writePost = (event, ctx, cb) => {
      ctx.callbackWaitsForEmptyEventLoop = false;
      const { title, body, tags } = JSON.parse(event.body);

      connect().then(
            () => {
                  return Post.write({ title, body, tags });
            }
      ).then(
            post => {
                  cb(null, createResponse(200, post));
            }
      ).catch(
            e => cb(e)
      );
};