const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const { pool } = require("./database");
const authorization = require("./middleware/authorization");
const logWritter = require("./utils/logWritter");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.set("port", process.env.PORT || 5000);
app.set("trust proxy", true);

//API Endpoints
//app.use("/", require("./routes/jwtAuth"));
app.use("/users", require("./routes/users"));
app.use("/conferences", require("./routes/conferences"));
app.use("/conferencesessions", require("./routes/conferenceSessions"));
app.use("/papers", require("./routes/papers"));
app.use("/paperversions", require("./routes/paperVersions"));
app.use("evaluations", require("./routes/evaluations"));

// test routes

app.post("/testput", async (req, res) => {
	// add an user
	/*
		Email VARCHAR(255) NOT NULL,
  UNIQUE (Email),
  Password VARCHAR(255) NOT NULL,
  FirstName VARCHAR(255) NOT NULL,
  LastName VARCHAR(255) NOT NULL,
		*/
	try {
		const { rows } = await pool.query("INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *", [
			"test@test.com",
			"test1234",
			"test",
			"test",
		]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "User not found",
			});
		}
		return res.status(201).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send(err.message);
	}
});

// get all users
app.get("/testget", async (req, res) => {
	try {
		const { rows } = await pool.query("SELECT * FROM users");
		if (rows.length === 0) {
			return res.status(404).json({
				message: "No users found",
			});
		}
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send(err.message);
	}
});

app.get("*", async (req, res) => {
	res.status(404).send("404 Not Found");
});

logWritter("Server started");
// Starting server
// exit codes
// 200 - OK
// 201 - Created
// 400 - Bad Request
// 401 - Unauthorized
// 403 - Forbidden
// 500 - Internal Server Error

app.listen(app.get("port"), function () {
	console.log(`Starting server on port ${app.get("port")}`);
});
