const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

const config = require("./config/key");
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

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

app.post("/login", function (req, res) {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "입력하신 이메일에 해당하는 유저가 없습니다."
      });
    }
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

      //비밀번호까지 맞다면 토큰을 생성한다.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 쿠키에 저장한다.
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.listen(port, function () {
  console.log(`server is running on port ${port}!`);
});
