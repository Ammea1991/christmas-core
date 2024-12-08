const mongoose = require("mongoose");

const db = require("../models");
const Message = db.messages;

const bcrypt = require("bcryptjs");

exports.create = async (req, res) => {
	const body = req.body.message; // Recupera l'oggetto `message` dal body della richiesta
  
	try {
	  // Crea una nuova istanza del modello con i dati ricevuti
	  const message = new Message({
		message: {
		  title: body.title,
		  text: body.text,
		},
	  });

	
	  // Salva l'istanza nel database
	  const savedMessage = await message.save();
	console.log(savedMessage);
	  // Risposta con successo
	  res.status(201).send({
		message: {
		  title: "Message created",
		  content: `Message with ID ${savedMessage._id} created successfully!`,
		},
		savedMessage,
	  });
	} catch (err) {
	  // Gestione degli errori
	  console.error(err);
	  res.status(500).send({
		message: {
		  title: "Internal server error",
		  content: "Error creating message",
		},
		error: err.message,
	  });
	}
  };

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
		const { _id } = req.query;

		const {message} = await Message.findOne({ _id });

		if (!message) {
			return res.status(404).send({ error: "Message not found!" });
		}
		res.status(200).send({ message });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
};

exports.getMessages = async (req, res) => {
	try {
		const Messages = await Message.find({});

		res.send({ Messages });
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
