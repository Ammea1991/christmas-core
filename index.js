require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware per parsare JSON
app.use(express.json());

// Route di base
app.get('/', (req, res) => {
	res.send('Ciao dal backend Node.js!');
});

// Avvia il server
app.listen(PORT, () => {
	console.log(`Server avviato su http://localhost:${PORT}`);
});
