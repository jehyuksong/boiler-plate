const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const config = require("./config/key");
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

mongoose
  .connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", function (req, res) {
  res.send("hello world");
});

app.post("/register", function (req, res) {
  const user = new User(req.body);

  user.save(function (err, userInfo) {
    if (err) {
      return res.json({ success: false, err });
    } else {
      return res.status(200).json({ success: true });
    }
  });
});

app.listen(port, function () {
  console.log(`server is running on port ${port}!`);
});
