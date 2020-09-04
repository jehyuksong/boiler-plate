const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://admin-jehyuk:asdf1234@cluster0.ksfes.mongodb.net/<dbname>?retryWrites=true&w=majority", //
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", function (req, res) {
  res.send("hello world");
});

app.listen(port, function () {
  console.log(`server is running on port ${port}!`);
});
