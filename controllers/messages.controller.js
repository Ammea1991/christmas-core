const mongoose = require("mongoose");

const db = require("../models");
const Message = db.messages;

const bcrypt = require("bcryptjs");

exports.delete = (req, res) => {
	Message.deleteOne({ _id: req.body._id }).exec((err, Message) => {
		if (err) throw err;

		Message.find({}, async (err, Message) => {
			const Messages = await Message.find({});
			if (!Message)
				return res
					.status(404)
					.send({ message: { title: "Message not found", content: `Message ${req.body.email} not found!` } });
			res
				.status(200)
				.send({ data: Message, Messages, message: { title: "Message deleted", content: `Message ${req.body.email} deleted!` } });
		});
	});
};

exports.update = async (req, res) => {
	const body = req.body.Message;
	const MessageId = body._id;
	// Controlla se l'ID è valido
	if (!mongoose.Types.ObjectId.isValid(MessageId)) {
		return res.status(400).send({ message: "Invalid Message ID" });
	}

	const myquery = { _id: MessageId };
	const newvalues = {
		$set: {
			gender: body.gender,
			name: body.name,
			surname: body.surname,
			birth_date: body.birth_date,
			birth_location: body.birth_location,
			phone_number: body.phone_number,
			address: body.address,
			codice_fiscale: body.codice_fiscale,
			email: body.email,
			created_at: new Date().toISOString(),
			settings: body.settings,
		},
	};

	try {
		const result = await Message.updateOne(myquery, newvalues);
		if (result.nModified === 0) {
			return res.status(404).send({ message: { title: "Message not found", content: `Message ${body.email} not found!` } });
		}

		const updatedMessage = await Message.findById(MessageId); // Recupera l'utente aggiornato

		const Messages = await Message.find({});

		res
			.status(200)
			.send({ message: { title: "Message updated", content: `Message ${body.email} updated!` }, data: updatedMessage, Messages });
	} catch (err) {
		console.error("Error updating Message:", err);
		res.status(500).send({ message: { title: "Internal server error", content: "Error updating Message" }, error: err });
	}
};


exports.getMessage = async (req, res) => {
	try {
		const { id } = req.params;
		console.log(id);

		const Message = await Message.findOne({ _id: id });

		if (!Message) {
			return res.status(404).send({ message: "Message not found!" });
		}
		res.status(200).send({ message: "Message found!", data: Message });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

exports.getMessages = async (req, res) => {
	try {
		const Messages = await Message.find({});
		console.log(Messages);
		res.send({ data: Messages });
	} catch (error) {
		res.status(500).send("Internal Server Error");
	}
};
exports.searchMessages = async (req, res) => {
	try {
		const searchString = req.query.q;
		const MessagesFound = await Message.find({ $text: { $search: searchString } });

		res.send({ data: MessagesFound });
	} catch (err) {
		res.status(500).send("Internal Server Error");
	}
};

exports.verifyOld = (req, res) => {
	Message.findOne({
		email: req.body.email,
	}).exec((err, Message) => {
		if (err) {
			res.status(500).send({ message: err });
			return;
		}

		if (!Message) {
			return res.status(404).send({ message: "Message Not found." });
		}

		var passwordIsValid = bcrypt.compareSync(req.body.password, Message.password);

		if (!passwordIsValid) {
			return res.status(401).send({
				accessToken: null,
				message: "Invalid Password!",
			});
		}

		res.status(200).send({ message: "Password old corretta!" });
	});
};

exports.fiscalCode = async (req, res) => {
	const { name, surname, birth_date, gender, birth_location } = req.body;

	if (!name || !surname || !birth_date || !gender || !birth_location) {
		return res.status(400).send({ error: "Missing required fields" });
	}

	try {
		const codiceFiscale = await calcolaCodiceFiscale(name, surname, birth_date, gender, birth_location);

		res.send({ data: codiceFiscale });
	} catch (error) {
		res.status(500).send({ error: error.message });
	}
};

exports.saveSettings = async (req, res) => {
	try {
		const { settings, _id } = req.body;

		const result = await Message.findOneAndUpdate({ _id: _id }, { $set: { settings: settings } }, { new: true });

		if (!result) {
			return res.status(404).send({ message: "Message not found!" });
		}

		res.status(200).send({ message: "Settings saved!", data: result });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};
