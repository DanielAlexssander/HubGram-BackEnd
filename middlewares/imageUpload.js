const multer = require("multer");
const path = require("path");

// Destionation to store image
const imageStorange = multer.diskStorage({
	destination: (req, file, cb) => {
		let folder = "";

		if (req.baseUrl.includes("users")) {
			folder = "users";
		} else if (req.baseUrl.includes("photos")) {
			folder = "photos";
		}

		cb(null, `uploads/${folder}/`);
	},
	filename: (req, file, cb) => {
		cb(
			null,
			`${file.originalname} - ${Date.now()}` + path.extname(file.originalname)
		);
	},
});

const imageUpload = multer({
	storage: imageStorange,
	fileFilter: (req, file, cb) => {
		if (!file.originalname.match(/\.(png|jpg)$/)) {
			// upload only png and jpg formats
			return cb(new Error("Please only send PNG or JPG files!"));
		}

		cb(undefined, true);
	},
});

module.exports = { imageUpload };
