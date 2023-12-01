import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';
import passport from 'passport';
import jwtStrategy from './middleware/jwtStrategy.js';

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

app.use('/', routes.auth);
app.use('/', routes.posts);
app.use('/', routes.comments);

passport.use(jwtStrategy);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
