const User = require("../models/User");

const Photo = require("../models/Photo");
const Comment = require("../models/Comment");

const mongoose = require("mongoose");

// Insert a photo, with an user related to it
const insertPhoto = async (req, res) => {
	const { title } = req.body;
	const image = req.file.filename;

	const reqUser = req.user;

	const user = await User.findById(reqUser._id);

	// Create a photo
	const newPhoto = await Photo.create({
		image,
		title,
		userId: user._id,
		userName: user.name,
	});

	// if photo was created sucessfully, return data
	if (!newPhoto) {
		res.status(422).json({ errors: ["There was a problem, Try again later."] });
		return;
	}

	res.status(201).json(newPhoto);
};

// Remove a photo from DB
const deletePhoto = async (req, res) => {
	const { id } = req.params;
	const reqUser = req.user;
	try {
		const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

		// Check if photo exists
		if (!photo) {
			res.status(404).json({ errors: ["Photo not found."] });
			return;
		}

		// Check if photo belongs to user
		if (!photo.userId.equals(reqUser._id)) {
			res
				.status(422)
				.json({ errors: ["There was a problem, Try again later."] });
			return;
		}

		await Photo.findByIdAndDelete(photo._id);

		res
			.status(200)
			.json({ id: photo._id, message: "Photo deleted sucessfully." });
	} catch (error) {
		res.status(404).json({ errors: ["Photo not found."] });
	}
};

// Get all photos
const getAllPhotos = async (req, res) => {
	const photos = await Photo.find({})
		.sort([["createdAt", -1]])
		.exec();

	return res.status(200).json(photos);
};

// Get user photos
const getUserPhotos = async (req, res) => {
	const { id } = req.params;

	const photos = await Photo.find({ userId: id })
		.sort([["createdAt", -1]])
		.exec();

	return res.status(200).json(photos);
};

// Get photo by id
const getPhotoById = async (req, res) => {
	const { id } = req.params;

	const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

	if (!photo) {
		res.status(404).json({ errors: ["Photo not found."] });
		return;
	}

	return res.status(200).json(photo);
};

// Upadate a photo
const updatePhoto = async (req, res) => {
	try {
		const { id } = req.params;
		const { title } = req.body;

		const reqUser = req.user;

		const photo = await Photo.findById(id);

		if (!photo) {
			res.status(404).json({ errors: ["Photo not found."] });
			return;
		}

		if (!photo.userId.equals(reqUser._id)) {
			res
				.status(422)
				.json({ errors: ["There was a problem, Try again later."] });
			return;
		}

		if (title) {
			photo.title = title;
		}

		await photo.save();

		return res.status(200).json({ photo, message: "Photo Updated." });
	} catch (error) {
		res.status(404).json({ errors: ["Photo not found."] });
		return;
	}
};

// Like functionalitty
const likePhoto = async (req, res) => {
	const { id } = req.params;
	const reqUser = req.user;

	const photo = await Photo.findById(id);

	if (!photo) {
		res.status(404).json({ errors: ["Photo not found."] });
		return;
	}

	// liked photo
	if (photo.likes.includes(reqUser._id)) {
		let index = photo.likes.indexOf(reqUser._id);

		photo.likes.splice(index, 1);
		photo.save();
		return res.status(200).json({
			photoId: id,
			userId: reqUser.id,
			message: "The photo has been disliked.",
		});
	}

	photo.likes.push(reqUser._id);
	await photo.save();

	return res.status(200).json({
		photoId: id,
		userId: reqUser.id,
		message: "The photo has been liked.",
	});
};

// Comment functionality
const commentPhoto = async (req, res) => {
	try {
		const { id } = req.params;
		const { comment } = req.body;
		const reqUser = req.user;
		const user = await User.findById(reqUser._id);
		const photo = await Photo.findById(id);

		if (!photo) {
			res.status(404).json({ errors: ["Photo not found."] });
			return;
		}

		// Create a photo
		const newComment = await Comment.create({
			comment,
			userName: user.name,
			userImage: user.profileImage,
			imageId: id,
			userId: user._id,
		});

		// if photo was created sucessfully, return data
		if (!newComment) {
			res
				.status(422)
				.json({ errors: ["There was a problem, Try again later."] });
			return;
		}

		photo.comments.push(newComment);
		await photo.save();

		return res.status(200).json({
			comment: newComment,
			message: "The comment has been successfully added.",
		});
	} catch (error) {
		res.status(404).json({ errors: ["Photo not found."] });
		return;
	}
};

// Remove a photo from DB
const deleteComment = async (req, res) => {
	try {
		const { id } = req.params;
		const reqUser = req.user;

		const comment = await Comment.findById(id);

		const imageId = comment.imageId;
		const photo = await Photo.findById(imageId);

		// Check if photo exists
		if (!comment) {
			res.status(404).json({ errors: ["Comment not found."] });
			return;
		}

		// Check if photo belongs to user
		if (!comment.userId.equals(reqUser._id)) {
			res
				.status(422)
				.json({ errors: ["There was a problem, Try again later."] });
			return;
		}

		await Comment.findByIdAndDelete(comment._id);

		let index = photo.comments.indexOf({ _id: comment._id });

		photo.comments.splice(index, 1);
		photo.save();
		return res
			.status(200)
			.json({ id: photo._id, message: "Comment deleted sucessfully." });
	} catch (error) {
		res.status(404).json({ errors: ["Comment not found."] });
	}
};

// Search photos by title
const searchPhotos = async (req, res) => {
	const { q } = req.query;
	const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

	res.status(200).json(photos);
};

module.exports = {
	insertPhoto,
	deletePhoto,
	getAllPhotos,
	getUserPhotos,
	getPhotoById,
	updatePhoto,
	likePhoto,
	commentPhoto,
	deleteComment,
	searchPhotos,
};
