import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const app = express();

app.use(cors());

app.listen(process.env.PORT, () => {
	console.log(`App listening on port ${process.env.PORT}`);
});

console.log('Hello App!');