const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.messages = require("./message.model");
db.session = require("./session.model");

module.exports = db;
