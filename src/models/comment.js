import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
	{
		message: { type: String, required: true, minLength: 3, maxLength: 150 },
		author: { type: String, required: true },
		postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
	},
	{ timestamps: {} },
);

export default mongoose.model('Comment', CommentSchema);
