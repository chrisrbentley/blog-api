import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PostSchema = new Schema(
	{
		title: { type: String, required: true, minLength: 5, maxLength: 100 },
		contentHTML: { type: String, required: true, minLength: 100 },
		author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		published: { type: Boolean, required: true },
		publishedAt: { type: Date, default: Date.now() },
	},
	{
		timestamps: {},
	},
);

PostSchema.pre('save', function (next) {
	console.log('isModified:', this.isModified('published'));
	if (this.isModified('published') && this.published) {
		this.publishedAt = new Date();
	}

	next();
});

export default mongoose.model('Post', PostSchema);
