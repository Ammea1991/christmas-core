// require('dotenv').config();
import express, { json } from 'express';

const app = express();
const PORT = 3001;

// Middleware per parsare JSON
app.use(json());

// Route di base
app.get('/', (req, res) => {
	res.send('Ciao dal backend Node.js!');
});

// Avvia il server
app.listen(PORT, () => {
	console.log(`Server avviato su http://localhost:${PORT}`);
});
