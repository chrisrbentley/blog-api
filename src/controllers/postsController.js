import Post from '../models/post.js';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';

const newPost = [
	body('title', 'Title cannot be empty.').trim().notEmpty().escape(),
	body('contentHTML', 'Blog must be at least 100 characters.')
		.trim()
		.isLength({ min: 100 })
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

		const { title, contentHTML } = req.body;

		const post = new Post({
			title: title,
			contentHTML: contentHTML,
			author: req.user.sub,
			published: req.body.published,
		});

		await post.save();
		res.status(201).send({ post });
	}),
];

const getAllPosts = asyncHandler(async (_req, res) => {
	let posts = [];
	posts = await Post.find({}).sort({ dateCreated: -1 });

	if (posts.length === 0)
		return res.status(404).send({ message: 'No posts found' });

	return res.status(200).send(posts);
});

const getPublishedPosts = asyncHandler(async (_req, res) => {
	const posts = await Post.find({ published: true }).sort({ dateCreated: -1 });

	if (posts.length === 0)
		return res.status(404).send({ message: 'No posts found' });

	return res.status(200).send(posts);
});

const getUnpublishedPosts = asyncHandler(async (_req, res) => {
	const posts = await Post.find({ published: false }).sort({ dateCreated: -1 });

	if (posts.length === 0)
		return res.status(404).send({ message: 'No posts found' });

	return res.status(200).send(posts);
});

const getPost = asyncHandler(async (req, res) => {
	const post = await Post.findById(req.params.id);

	if (!post) return res.status(404).send({ message: 'Post not found' });

	res.status(200).send(post);
});

const updatePost = asyncHandler(async (req, res) => {
	const { title, contentHTML, published } = req.body;
	const post = await Post.findById(req.params.id);

	if (!post) return res.status(404).send({ message: 'Post not found' });

	Object.assign(post, { title, contentHTML, published });
	await post.save();
	return res.status(204).send(post);
});

const deletePost = asyncHandler(async (req, res) => {
	const postID = String(req.params.id);
	const post = await Post.findOneAndDelete({ _id: postID });

	if (!post) {
		return res.status(404).send({ message: 'Post not found' });
	}

	return res.status(204).send();
});

export default {
	newPost,
	getAllPosts,
	getPublishedPosts,
	getUnpublishedPosts,
	getPost,
	updatePost,
	deletePost,
};
