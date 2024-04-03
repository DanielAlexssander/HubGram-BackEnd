const { body } = require("express-validator");

const userCreateValidation = () => {
	return [
		body("name")
			.isString()
			.withMessage("Name is required.")
			.isLength({ min: 3 })
			.withMessage("The name needs to have at least 3 characters."),
		body("email")
			.isString()
			.withMessage("Email is required.")
			.isEmail()
			.withMessage("Please enter a valid email."),
		body("password")
			.isString()
			.withMessage("Password is required.")
			.isLength({ min: 8 })
			.withMessage("The password needs to have at least 8 characters.")
			.custom((value) => {
				if (value === "12345678") {
					throw new Error("The password cannot be a sequential number.");
				}
				return true;
			}),
		body("confirmpassword")
			.isString()
			.withMessage("Comfirm Password is required.")
			.custom((value, { req }) => {
				if (value != req.body.password) {
					throw new Error("The passwords do not match.");
				}
				return true;
			}),
	];
};

const loginValidation = () => {
	return [
		body("email")
			.isString()
			.withMessage("Email is required.")
			.isEmail()
			.withMessage("Please enter a valid email."),
		body("password").isString().withMessage("Password is required."),
	];
};

const userUpdateValidation = () => {
	return [
		body("name")
			.optional()
			.isLength({ min: 3 })
			.withMessage("The name needs to have at least 3 characters."),
		body("password")
			.optional()
			.isLength({ min: 8 })
			.withMessage("The password needs to have at least 8 characters."),
	];
};

module.exports = {
	userCreateValidation,
	loginValidation,
	userUpdateValidation,
};
