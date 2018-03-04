const {
      codes,
      errorMessage,
      createResponse
} = require('../lib/response');

const connect = require('../db');
const Post = require('../db/models/Post');
const Joi = require('joi');

module.exports.writePost = (event, ctx, cb) => {
      ctx.callbackWaitsForEmptyEventLoop = false;
      const body = JSON.parse(event.body);

      //validation
      const schema = Joi.object().keys({
            title: Joi.string().required().min(3),
            body: Joi.string().required().min(3),
            tags: Joi.array().items(Joi.string())
      });
      const result = Joi.validate(body, schema);

      if(result.error){
            cb(null, errorMessage(codes.BAD_REQUEST, result.error.message));
            return;
      }
      connect().then(
            () => Post.write(body)
      ).then(
            post => {
                  cb(null, createResponse(codes.SUCESS, post));
            }
      ).catch(
            e => cb(e)
      );
};

module.exports.readPostList = (event, ctx, cb) => {
      ctx.callbackWaitsForEmptyEventLoop = false;
      // const { page, tag } = event.queryStringParameters;
      // if(parseInt(page || 1, 10) < 1) {
      //       cb(null, errorMessage(codes.BAD_REQUEST, 'page < 1'));
      //       return;
      // }
      // connect().then(
      //       () => Post.getList({ page, tag})
      // ).then(
      //   postList => cb(null, createResponse(200, postList))
      // );
      connect().then(
            () => Post.find().sort({ _id: -1 }).limit(5).lean().exec()
      ).then(
            PostList => cb(null, createResponse(200, PostList))
      );
};