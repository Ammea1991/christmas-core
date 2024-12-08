const mongoose = require("mongoose");

const User = mongoose.model(
	"User",
	new mongoose.Schema({
		gender: { type: String },
		name: String,
		surname: String,
		birth_date: { type: String },
		birth_location: {
			id: { type: String },
			label: { type: String },
			value: { type: String },
		},
		phone_number: String,
		address: {
			country: { type: String },
			region: { type: String },
			province: { type: String },
			locality: { type: String },
			route: { type: String },
			street_number: { type: String },
			postal_code: { type: String },
		},
		codice_fiscale: String,
		email: String,
		password: String,
		created_at: { type: Date },
		settings: {
			theme: { tupe: String },
		},
	}).index({ "$**": "text" })
);

module.exports = User;
