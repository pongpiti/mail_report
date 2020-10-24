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

router.get("/DeliveryNote", enSureAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("email");
    var query = { subject: "ใบส่งสินค้า" };
    dbo
      .collection("data")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render("showdatainemail/DeliveryNote", { lists: result });
      });
  });
});

router.get("/PurchaseReq", enSureAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("email");
    var query = { subject: "ใบขอซื้อ" };
    dbo
      .collection("data")
      .find(query)
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.render("showdatainemail/PurchaseReq", { lists: result });
      });
  });
});

router.get("/Quatation", enSureAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("email");
    var query = { subject: "ใบเสนอราคา" };
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

router.post("/all", enSureAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    var date = req.body.date;
    if (err) throw err;
    var dbo = db.db("email");
    var query1 = {
      $or: [
        { subject: "ใบเสนอราคา" },
        { subject: "ใบแจ้งหนี้" },
        { subject: "ใบเสร็จ" },
        { subject: "สั่งซื้อสินค้า" },
        { subject: "ใบส่งสินค้า" },
        { subject: "ใบขอซื้อ" },
      ],
      $and: [{ date: date }],
    };
    dbo
      .collection("data")
      .find(query1)
      .toArray(async function (err, result) {
        var col = dbo.collection("data");
        const dates = await col.distinct("date");
        if (err) throw err;
        db.close();
        res.render("showdatainemail/all", { lists: result, datetime: dates });
      });
  });
});
router.get("/all", enSureAuthenticated, function (req, res, next) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("email");
    var query1 = {
      $or: [
        { subject: "ใบเสนอราคา" },
        { subject: "ใบแจ้งหนี้" },
        { subject: "ใบเสร็จ" },
        { subject: "สั่งซื้อสินค้า" },
        { subject: "ใบส่งสินค้า" },
        { subject: "ใบขอซื้อ" },
      ],
    };
    dbo
      .collection("data")
      .find(query1)
      .toArray(async function (err, result) {
        var col = dbo.collection("data");
        const dates = await col.distinct("date");
        if (err) throw err;
        db.close();
        res.render("showdatainemail/all", { lists: result, datetime: dates });
      });
  });
});

module.exports = router;
