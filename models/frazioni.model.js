const mongoose = require("mongoose");

const Frazioni = mongoose.model(
	"Frazioni",
	new mongoose.Schema({
		id: { type: String },
		istat_comune: { type: String },
		frazione: { type: String },
	}).index({ "$**": "text" })
);

module.exports = Frazioni;
