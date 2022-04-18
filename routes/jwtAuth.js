const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");

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
		res.json(token);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
