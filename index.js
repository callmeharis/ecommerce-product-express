require("dotenv").config();
const express = require("express");
const connectDB = require("./database/connect");
const router = require("./routes/user");
const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(express.json());
app.use("/", router);

app.get("/", (req, res) => {
  res.send("APIs Working");
});

app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
