require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT || 3000;

const app = express();

// Solve CORS
// { credentials: true, origin: "http://localhost:3000" }
const corsOptions = {
	credentials: false,
	origin: "https://hubgram.netlify.app",
};
app.use(cors(corsOptions));

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// DB connection
require("./config/db.js");

// config JSON and form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes
const router = require("./routes/Router");

app.use(router);

app.listen(port, () => {
	console.log("Port " + port);
});
