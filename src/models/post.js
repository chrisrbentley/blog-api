import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema({
	title: { type: String, required: true, minLength: 5, maxLength: 100 },
	contentHTML: { type: String, required: true, minLength: 20 },
	dateCreated: { type: Date, required: true, default: Date.now() },
	datePublished: { type: Date, required: true, default: Date.now() },
	author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	public: { type: Boolean, default: true },
});

export default mongoose.model('Post', PostSchema);
