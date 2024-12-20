

const controller = require("../controllers/messages.controller");

module.exports = async function (app) {
	app.use(function (req, res, next) {
		res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
		next();
	});
    
    app.get("/api/message", controller.getMessage);

	app.get("/api/messages",  controller.getMessages);

    app.post("/api/messages/create", controller.create);
};
