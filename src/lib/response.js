const createResponse = (status, body) => ({
      statusCode: status,
      body: JSON.stringify(body)
});

module.exports = createResponse;