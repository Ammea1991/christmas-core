const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.session = require("./session.model");
db.comuni = require("./comuni.model");
db.frazioni = require("./frazioni.model");

module.exports = db;
