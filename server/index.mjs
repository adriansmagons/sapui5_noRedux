import express from 'express';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import path from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

const testData = [
					{
						"_id": 333,
						"name": "Karl",
						"surname": "Iowa",
						"age": 44,
						"gender": "male",
						"position": "Full-back"
					},
					{
						"_id": 222,
						"name": "Jane",
						"surname": "Smith",
						"age": 33,
						"gender": "female",
						"position": "Full-back"
					},
					{
						"_id": 111,
						"name": "Peter",
						"surname": "Mcdonald",
						"age": 24,
						"gender": "male",
						"position": "Centre-back"
					}
			]

// app.use(bodyParser.json());

// app.use('/client', express.static(path.join(__dirname, '../webapp')));

// app.get('/api', (req, res) => {
// 	res.sendStatus(404);
// });

app.get('/api/athletes', (req, res) => {
	setTimeout(() => {
		res.json(testData);
		}, "3000");       // simulate loading
});
app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Server");
});

app.listen(3001, () => {
	console.log(`Server running on http://localhost:3001`);
});
