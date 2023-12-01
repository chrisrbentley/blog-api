import Comment from '../models/comment.js';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

const newComment = [
	body('author', 'Name is required').trim().notEmpty().escape(),
	body('message', 'Message must be between 3-150 characters')
		.trim()
		.isLength({ min: 3, max: 150 })
		.escape(),

	asyncHandler(async (req, res) => {
		const results = validationResult(req);
		if (!results.isEmpty()) {
			const errors = {};
			results.array().forEach((result) => {
				errors[result.path] = result.msg;
			});
			return res.status(400).send(errors);
		}

		const { author, message } = req.body;

		const comment = new Comment({
			author,
			message,
			postId: req.params.id,
		});

		const savedComment = await comment.save();
		if (!savedComment)
			return res.status(500).send({
				message: 'Internal Server Error: Failed to save the comment.',
			});

		res.status(201).send(comment);
	}),
];

const getPostComments = asyncHandler(async (req, res) => {
	const postId = req.params.id;

	const postsComments = await Comment.find({ postId })
		.select('message author createdAt')
		.sort({ createdAt: -1 })
		.exec();

	if (postsComments.length < 1) {
		return res.status(404).send({ message: 'No comments found' });
	}
	res.status(200).send(postsComments);
});

const deleteComments = asyncHandler(async (req, res) => {
	const { commentId } = req.params;
	const comment = await Comment.findOneAndDelete({ _id: commentId });

	if (!comment) {
		return res.status(404).send({ message: 'Comment not found' });
	}
	return res.status(204).send();
});

export default {
	newComment,
	getPostComments,
	deleteComments,
};
