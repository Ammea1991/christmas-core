const mongoose = require("mongoose");

const Message = mongoose.model(
	"Message",
	new mongoose.Schema({
		message: {
			title: { type: String },
			text: { type: String },
		},
	}).index({ "$**": "text" })
);

module.exports = Message;
