import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';

const app = express();

const dbURI = process.env.MONGODB_URI;
const mongoConnect = async () => {
	try {
		await mongoose.connect(dbURI);
	} catch (err) {
		console.log(`Could not connect to DB, ${err}`);
	}
};
mongoConnect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/sign-up', routes.signUp);

app.listen(process.env.PORT, () => {
	console.log(`App listening on port ${process.env.PORT}`);
});
