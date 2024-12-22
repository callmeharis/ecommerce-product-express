require("dotenv").config();
const express = require("express");
const connectDB = require("./database/connect");
const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
