const createResponse = (status, body) => ({
      statusCode: status,
      body: JSON.stringify(body)
});

const errorMessage = (status, message) => ({
      statusCode: status,
      body: JSON.stringify({
            errorMessage: message
      })
});

const codes = {
      SUCESS                  : 200,
      NO_CONTENT              : 204,
      BAD_REQUEST             : 400,
      UNAUTHORIZED            : 401,
      FORBIDDEN               : 403,
      NOT_FOUND               : 404,
      CONFLICT                : 409,
      INTERNAL_SERVER_ERROR   : 500
}

module.exports = {
      codes,
      createResponse,
      errorMessage
};