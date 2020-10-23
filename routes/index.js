var express = require("express");
var router = express.Router();

function enSureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/users/login");
  }
}

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://pongpiti_1:1234@cluster0-rbtdf.mongodb.net/email?retryWrites=true&w=majority";

/* GET home page. */
router.get("/", enSureAuthenticated, function (req, res, next) {
  res.render("user/login");
});

router.get("/home", enSureAuthenticated, function (req, res, next) {
  res.render("index");
});

router.get("/Quatation", enSureAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("email");
    /*Return only the documents with the address "Park Lane 38":*/
    var query = { subject: "ขายสินค้า" };
    dbo
      .collection("data")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render("showdatainemail/Quatation", { lists: result });
      });
  });
});
router.get("/PurchaseOrder", enSureAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("email");
    /*Return only the documents with the address "Park Lane 38":*/
    var query = { subject: "สั่งซื้อสินค้า" };
    dbo
      .collection("data")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render("showdatainemail/PurchaseOrder", { lists: result });
      });
  });
});
router.get("/Receipt", enSureAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("email");
    /*Return only the documents with the address "Park Lane 38":*/
    var query = { subject: "ใบเสร็จ" };
    dbo
      .collection("data")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render("showdatainemail/Recepipt", { lists: result });
      });
  });
});
router.get("/Invoice", enSureAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("email");
    /*Return only the documents with the address "Park Lane 38":*/
    var query = { subject: "ใบแจ้งหนี้" };
    dbo
      .collection("data")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render("showdatainemail/Invioce", { lists: result });
      });
  });
});
router.get("/all", enSureAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("email");
    /*Return only the documents with the address "Park Lane 38":*/
    var query1 = { $or: [ { subject: "ขายสินค้า" }, { subject: "ใบแจ้งหนี้" }, { subject: "ใบเสร็จ" }, { subject: "สั่งซื้อสินค้า" } ] }

    dbo
      .collection("data")
      .find(query1)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render("showdatainemail/all", { lists: result });
      });
  });
});
/* GET addblog page. */
/* router.get("/addblog",enSureAuthenticated, function (req, res, next) {
  res.render("blog/addblog");
}); */
/* GET Myblog page. */
/* router.get("/Myblog",enSureAuthenticated, function (req, res, next) {
  res.render("blog/myblog");
}); */
/* GET about page. */
/* router.get("/about", function (req, res, next) {
  res.render("about/about");
}); */

module.exports = router;
