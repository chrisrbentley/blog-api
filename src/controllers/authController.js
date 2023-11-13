import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

const onSignUp = [
	/* asyncHandler(async (req, res) => {
		console.log('Sign Up!');
		console.log(req.body.username);
		res.json(req.body);
	}), */
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
			console.log(errors);
			//
			res.json(errors);
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

export default { onSignUp };
