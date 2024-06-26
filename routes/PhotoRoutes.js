const express = require("express");
const router = express.Router();

// Controller
const {
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
} = require("../controllers/PhotoController");

// Middlewares
const {
	photoInsertValidation,
	photoUpdateValidation,
	commentValidation,
} = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require("../middlewares/imageUpload");

// Routes
router.post(
	"/",
	authGuard,
	imageUpload.single("image"),
	photoInsertValidation(),
	validate,
	insertPhoto
);
router.get("/", getAllPhotos);
router.delete("/:id", authGuard, deletePhoto);
router.get("/user/:id", getUserPhotos);
router.get("/search", authGuard, searchPhotos);
router.get("/:id", getPhotoById);
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);
router.put("/like/:id", authGuard, likePhoto);
router.put(
	"/comment/:id",
	authGuard,
	commentValidation(),
	validate,
	commentPhoto
);
router.delete("/comment/:id", authGuard, deleteComment);

module.exports = router;
