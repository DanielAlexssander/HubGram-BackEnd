const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentSchema = new Schema(
	{
		comment: String,
		userName: String,
		userImage: String,
		imageId: String,
		userId: mongoose.ObjectId,
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
