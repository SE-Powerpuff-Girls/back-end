const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");
const logWritter = require("../utils/logWritter");

router.post("/register", validator, async (req, res) => {
	try {
		const { email, password, firstName, lastName } = req.body;

		const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
		if (user.rows.length > 0) {
			return res.status(400).json({
				message: "User already exists",
			});
		}

		const saltRounds = 10;
		const genSalt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(password, genSalt);

		const newUser = await pool.query("INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *", [
			email,
			hash,
			firstName,
			lastName,
		]);

		const token = jwtGenerator(newUser.rows[0].userid);
		res.json(token);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});
// login route

router.post("/login", validator, async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
		if (user.rows.length === 0) {
			return res.status(401).json({
				message: "User does not exist",
			});
		}

		const validPass = await bcrypt.compare(password, user.rows[0].password);
		if (!validPass) {
			return res.status(401).json({
				message: "Incorrect password",
			});
		}
		const token = jwtGenerator(user.rows[0].userid);
		logWritter(`User ${user.rows[0].firstname} ${user.rows[0].lastname} logged in`);
		res.json(token);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:userid", async (req, res) => {
	try {
		const users = await pool.query("SELECT * FROM users WHERE userid = $1", [req.params.userid]);
		res.json(users.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update an user
router.put("/:userid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete an user
router.delete("/:userid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all topics for an user
router.get("/:userid/topics", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// add a new topic
router.post("/:userid/topics", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// updatea a topic
router.put("/:userid/topics/:topicid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a topic
router.delete("/:userid/topics/:topicid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
