const {
      codes,
      errorMessage,
      createResponse
} = require('../lib/response');
const {
      LIST_SIZE
} = process.env;
const SIZE = parseInt(LIST_SIZE);
const connect = require('../db');
const Post = require('../db/models/Post');
const Joi = require('joi');

module.exports.writePost = (event, ctx, cb) => {
      ctx.callbackWaitsForEmptyEventLoop = false;
      const body = JSON.parse(event.body);

      const schema = Joi.object().keys({
            title: Joi.string().required().min(3),
            body: Joi.string().required().min(3),
            tags: Joi.array().items(Joi.string())
      });
      const result = Joi.validate(body, schema);

      if (result.error) {
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
      if (event.queryStringParameters === null) {
            cb(null, errorMessage(codes.BAD_REQUEST, '[page] is mandatory field'));
            return;
      }

      const page = parseInt(event.queryStringParameters.page || 1, 10);
      const {
            tag
      } = event.queryStringParameters;

      if (page < 1) {
            cb(null, errorMessage(codes.BAD_REQUEST, 'page < 1'));
            return;
      }

      let headerLastPage = null;
      connect().then(
            () => Post.getLastPage(tag)
      ).then(
            (totalSize) => {
                  const lastPage = Math.ceil(totalSize / SIZE);
                  headerLastPage = lastPage;
            }
      ).then(
            () => Post.getList({ page, tag })
      ).then(
            (postList) => {
                  const headers = { 'last-page': headerLastPage }
                  cb(null, createResponse(codes.SUCESS, postList, headers))
            }
      ).catch(
            e => cb(e)
      );
};

module.exports.updatePost = (event, ctx, cb) => {
      ctx.callbackWaitsForEmptyEventLoop = false;
      const { title, body, tags } = JSON.parse(event.body);
      const { id } = event.pathParameters;
      connect().then(
            () => Post.editPost({ id, title, body, tags })
      ).then(
            post => {
                  if (!post) {
                        const message = 'There is no content with an id [' + id + ']';
                        return cb(null, errorMessage(codes.NOT_FOUND, message));
                  }
                  cb(null, createResponse(codes.SUCESS, post));
            }
      );
};

module.exports.deletePost = (event, ctx, cb) => {
      ctx.callbackWaitsForEmptyEventLoop = false;
      const { id } = event.pathParameters;
      connect().then(
            () => Post.deletePost(id)
      ).then(
            () => cb(null, createResponse(codes.NO_CONTENT, null))
      );
};