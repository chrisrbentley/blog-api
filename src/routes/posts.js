import { Router } from 'express';
import postsController from '../controllers/postsController.js';
import passport from 'passport';

const router = Router();

router.post(
	'/posts',
	passport.authenticate('jwt', { session: false }),
	postsController.newPost,
);

router.get(
	'/posts',
	passport.authenticate('jwt', { session: false }),
	postsController.getAllPosts,
);

router.get('/posts/published-posts', postsController.getPublishedPosts);

router.get(
	'/posts/unpublished-posts',
	passport.authenticate('jwt', { session: false }),
	postsController.getUnpublishedPosts,
);

router.get('/posts/:id', postsController.getPost);

router.put(
	'/posts/:id',
	passport.authenticate('jwt', { session: false }),
	postsController.updatePost,
);

router.delete(
	'/posts/:id',
	passport.authenticate('jwt', { session: false }),
	postsController.deletePost,
);

export default router;
