const express = require("express");
const basicAuth = require("express-basic-auth");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
require("dotenv").config();

const cors = require("cors");
const db = require("./models");
const uri = process.env.DB_URI;

db.mongoose
	.set("strictQuery", true)
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("MongoDB successfully connected");
	})
	.catch((err) => {
		console.error("Connection error", err);
		process.exit();
	});

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = process.env.SITE_URL;

// Middleware condizionale

const corsOptions = {
	origin: allowedOrigins, // Sostituisci con l'URL del tuo frontend
	methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
	credentials: true, // Abilita l'invio di cookie
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Middleware basic auth
const basicAuthMiddleware = basicAuth({
	users: { admin: process.env.BASICAUTH_USR_PWD },
	challenge: true,
	unauthorizedResponse: (req) => "Unauthorized",
});

// Middleware per verificare l'origine della richiesta
function checkReferrer(req, res, next) {
	const referrer = req.get("Referrer") || req.get("Referer");
	const frontendUrl = process.env.SITE_URL;

	if ((referrer && referrer?.startsWith(frontendUrl)) || referrer?.startsWith("http://localhost:3000")) {
		if (req.path === "/api/auth/login") return next();

		return next();
	}

	return basicAuthMiddleware(req, res, next);
}
app.use((req, res, next) => {
	return checkReferrer(req, res, next);
});
// Middleware per impostare gli header CORS
app.use((req, res, next) => {
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}
	res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Credentials", "true"); // Abilita l'invio di credenziali
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require("./routes/messages.routes")(app);

app.get("/", (req, res) => {
	res.send("hello from mea server");
});

app.listen(PORT, () => {});
