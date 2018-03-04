const mongoose = require('mongoose');
const {
      MONGO_URI
} = process.env;

let connection = null;

const connect = () => {
   
      if (connection && mongoose.connection.readyState === 1) return Promise.resolve(connection);
      return mongoose.connect(MONGO_URI).then(
            conn => {
                  connection = conn;
                  return connection;
            }
      );
};

module.exports= connect;