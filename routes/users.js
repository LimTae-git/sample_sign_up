var express = require('express');
var router = express.Router();
var models = require("../models");
var crypto = require("crypto")

// 회원가입 GET
router.get('/sign_up', function(req, res, next){
  res.render("user/sign");
});

// 회원가입 POST
router.post("/sign_up", async function(req, res, next){
  let body = req.body;

  let inputPassword = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  let result = models.user.create({
    uid: body.userID,
    password: hashPassword,
    name: body.userName,
    birth: body.userBirth,
    phone: body.userPhone,
    salt: salt
  })
  res.redirect("/users/login")
  alert('회원가입이 완료되었습니다.');
  ;
})

// 메인 페이지
router.get('/home', function(req, res, next){
  res.render('user/home');
});

// 로그인 GET
router.get('/login', function(req, res, next){
  res.render("user/login");
});

// 로그인 POST
router.post("/login", async function(req, res, next){
  let body = req.body;

  let result = await models.user.findOne({
    where: {
      uid: body.userID
    }
  });

  let dbPassword = result.dataValues.password;
  let inputPassword = body.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  if(dbPassword = hashPassword){
    console.log("비밀번호가 일치합니다");
    res.redirect("/users/home");
  }
  else{
    console.log("비밀번호가 틀렸습니다.");
    res.redirect("/users/login");
  }
});

module.exports = router;
