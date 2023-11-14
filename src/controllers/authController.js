import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const onSignUp = [
	body('username', 'Username is already taken.')
		.trim()
		.isLength({ min: 3, max: 20 })
		.escape(),
	body('password', 'Password must be between 5-20 characters.')
		.trim()
		.isLength({ min: 5, max: 80 })
		.escape(),
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const formattedErrors = {};
			errors.array().forEach((error) => {
				formattedErrors[error.path] = error.msg;
			});
			return res.status(400).send(formattedErrors);
		} else {
			bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
				if (err) {
					console.error(`Error hashing password: ${err}`);
					res.status(500).send('Internal Server Error');
				} else {
					const user = new User({
						username: req.body.username,
						password: hashedPassword,
					});
					await user.save();
					res.json(user);
				}
			});
		}
	}),
];

const onLogin = [
	body('username', 'Username is required.').trim().notEmpty().escape(),
	body('password', 'Password is required.').trim().notEmpty().escape(),
	asyncHandler(async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const formattedErrors = {};
			errors.array().forEach((error) => {
				formattedErrors[error.path] = error.msg;
			});
			return res.status(400).send(formattedErrors);
		}

		const { username, password } = req.body;
		const user = await User.findOne({ username: username });

		if (!user) {
			return res.status(401).send({ message: 'Could not find user' });
		}

		const match = await bcrypt.compare(password, user.password);
		if (match) {
			const opts = {};
			opts.expiresIn = '10 minutes';
			const secret = process.env.JWT_SECRET;
			const token = jwt.sign({ sub: user._id, username }, secret, opts);

			return res.status(200).send({
				message: 'Authentication successful',
				token,
			});
		} else {
			return res.status(401).send({ message: 'Incorrect password' });
		}
	}),
];

export default { onSignUp, onLogin };
