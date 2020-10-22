var mongoose = require("mongoose");
var mongoDB =
  "mongodb+srv://pongpiti_1:1234@cluster0-rbtdf.mongodb.net/loginDB?retryWrites=true&w=majority";
var bcrypt = require("bcryptjs");
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Connect
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongodb Connect ErrorS"));

// Create Schema
var userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

var User = (module.exports = mongoose.model("User", userSchema));

// register
module.exports.createUser = function (newUser) {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, async function (err, hash) {
      newUser.password = hash;
      console.log(newUser);
      await newUser.save();
    });
  });
};

// find Id
module.exports.getUserById = function (id, callback) {
  User.findById(id, callback);
};

// query name
module.exports.getUserByName = function (name, callback) {
  var query = {
    name: name,
  };
  User.findOne(query, callback);
};

//compare Password
module.exports.comparePassword = function (password, hash, callback) {
  bcrypt.compare(password, hash, function (err, isMatch) {
    callback(null, isMatch);
  });
};
