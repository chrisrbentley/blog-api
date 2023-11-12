import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	message: { type: String, required: true, minLength: 3, maxLength: 150 },
	dateCreated: { type: Date, required: true, default: Date.now() },
	author: { type: String, required: true },
	post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
});

export default mongoose.model('Comment', CommentSchema);
