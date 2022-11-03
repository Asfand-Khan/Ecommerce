const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((data) => {
      console.log(
        `database connected succesfully on : ${data.connection.host}`
      );
    })
    .catch((err) => {
      console.log(`error while connecting to database: ${err}`);
    });
};

module.exports = connectDatabase;
