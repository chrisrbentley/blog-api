import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.js';

const createJwtOptions = () => {
	const opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = process.env.JWT_SECRET;
	return opts;
};

export default new JwtStrategy(
	createJwtOptions(),
	async (jwt_payload, done) => {
		try {
			const user = await User.findOne({ username: jwt_payload.username });
			const userPayload = {
				sub: user._id,
				username: user.username,
			};

			if (user) {
				return done(null, userPayload);
			} else {
				return done(null, false);
			}
		} catch (err) {
			return done(err, false);
		}
	},
);
