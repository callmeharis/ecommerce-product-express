const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(
        `DB CONNECT SUCCESSFULLY WITH HOST ${mongoose.connection.host}`
      );
    })
    .catch((err) => {
      console.log(`CONNECTION ERROR ${err}`);
    });
};

module.exports = connectDB;
