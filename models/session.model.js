const mongoose = require("mongoose");

const Session = mongoose.model(
	"Session",
	new mongoose.Schema({
		ACC_SESS_ID: String,
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	}).index({ "$**": "text" })
);

module.exports = Session;
