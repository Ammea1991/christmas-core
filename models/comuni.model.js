const mongoose = require("mongoose");

const Comuni = mongoose.model(
	"Comuni",
	new mongoose.Schema({
		istat: { type: String },
		comune: { type: String },
		regione: { type: String },
		provincia: { type: String },
		prefisso: { type: String },
		cod_fisco: { type: String },
		num_residenti: { type: String },
		superficie: { type: String },
		cf: { type: String },
	}).index({ "$**": "text" })
);

module.exports = Comuni;
