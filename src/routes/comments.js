import { Router } from 'express';
import commentsController from '../controllers/commentsController.js';
import passport from 'passport';

const router = Router();

router.post('/posts/:id/comments', commentsController.newComment);

router.get('/posts/:id/comments', commentsController.getPostComments);

router.delete(
	'/posts/:id/comments/:commentId',
	passport.authenticate('jwt', { session: false }),
	commentsController.deleteComments,
);

export default router;
