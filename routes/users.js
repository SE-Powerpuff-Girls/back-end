const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");
//const logWritter = require("../utils/logWritter");
const multer = require("multer");
const addFile = require("../utils/fileUpload");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

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

		const token = jwtGenerator(newUser.rows[0].userid, newUser.rows[0].firstname, newUser.rows[0].lastname, newUser.rows[0].email);
		res.status(201).json({ token, newUser });
	} catch (err) {
		console.log(err.message);
		res.status(500).send(err.message);
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
		const token = jwtGenerator(user.rows[0].userid, user.rows[0].firstname, user.rows[0].lastname, user.rows[0].email);
		//logWritter(`User ${user.rows[0].firstname} ${user.rows[0].lastname} logged in`);
		output = {
			userid: user.rows[0].userid,
			firstname: user.rows[0].firstname,
			lastname: user.rows[0].lastname,
			email: user.rows[0].email,
			title: user.rows[0].title,
			gender: user.rows[0].gender,
			nationality: user.rows[0].nationality,
			adress: user.rows[0].address,
			photolink: user.rows[0].photolink,
		};
		res.status(201).json({ token, output });
	} catch (err) {
		console.log(err.message);
		res.status(500).send(err.message);
	}
});

router.get("/:userid", async (req, res) => {
	try {
		const user = await pool.query("SELECT * FROM users WHERE userid = $1", [req.params.userid]);
		if (user.rows.length === 0) {
			return res.status(404).json({
				message: "User does not exist",
			});
		}
		output = {
			userid: user.rows[0].userid,
			firstname: user.rows[0].firstname,
			lastname: user.rows[0].lastname,
			email: user.rows[0].email,
			title: user.rows[0].title,
			gender: user.rows[0].gender,
			nationality: user.rows[0].nationality,
			adress: user.rows[0].address,
			photolink: user.rows[0].photolink,
		};
		res.status(200).json(output);
	} catch (err) {
		console.log(err.message);
		res.status(500).send(err.message);
	}
});

// update an user
router.put("/:userid", authorization, upload, async (req, res) => {
	try {
		const { firstName, lastName, title, gender, nationality, adress } = req.body;
		const user = pool.query("SELECT * FROM users where userid = $1", [req.params.userid]);
		if (firstName == null || firstName == undefined) {
			firstName = user.rows[0].firstname;
		}
		if (lastName == null || lastName == undefined) {
			lastName = user.rows[0].lastname;
		}
		if (title == null || title == undefined) {
			title = user.rows[0].title;
		}
		if (gender == null || gender == undefined) {
			gender = user.rows[0].gender;
		}
		if (nationality == null || nationality == undefined) {
			nationality = user.rows[0].nationality;
		}
		if (adress == null || adress == undefined) {
			adress = user.rows[0].adress;
		}

		let url = await addFile(req.file);
		if (url == null) {
			url = "";
		}
		let updated_user = pool.query(
			"UPDATE users SET firstname = $1, lastname = $2, title = $3, gender = $4, nationality = $5, adress = $6, photolink = $7 WHERE userid = $8 RETURNING *",
			[firstName, lastName, title, gender, nationality, adress, url, req.params.userid]
		);
		res.status(201).send(updated_user.rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send(err.message);
	}
});

// delete an user
router.delete("/:userid", authorization, async (req, res) => {
	try {
		if (req.userid !== req.params.userid) {
			return res.status(403).json({
				message: "You are not authorized to delete this user",
			});
		}
		const user = await pool.query("DELETE FROM users WHERE userid = $1", [req.params.userid]);
		res.status(200).send("User Deleted");
	} catch (err) {
		console.log(err.message);
		res.status(500).send(err.message);
	}
});

// get all topics for an user
router.get("/:userid/topics", async (req, res) => {
	try {
		const topics = await pool.query("SELECT * FROM usertopics WHERE userid = $1", [req.params.userid]);
		res.status(200).json(topics.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send(err.message);
	}
});

// add a new topic
router.post("/:userid/topics", authorization, async (req, res) => {
	try {
		if (req.userid !== req.params.userid) {
			return res.status(403).json({
				message: "You are not authorized to add a topic to this user",
			});
		}
		const text = req.body.name;
		const topic = await pool.query("INSERT INTO usertopics (userid, name) VALUES ($1, $2) RETURNING *", [req.params.userid, text]);
		res.status(201).json("Topic added");
	} catch (err) {
		console.log(err.message);
		res.status(500).send(err.message);
	}
});

// delete a topic
router.delete("/:userid/topics/:topicid", authorization, async (req, res) => {
	try {
		if (req.userid !== req.params.userid) {
			return res.status(403).json({
				message: "You are not authorized to delete this topic",
			});
		}
		const topic = await pool.query("DELETE FROM usertopics WHERE topicid = $1 AND userid = $2 RETURNING *", [req.params.topicid, req.params.userid]);
		if (topic.rows.length === 0) {
			return res.status(404).json({
				message: "Topic does not exist or you are not the owner",
			});
		}
		res.status(200).send("Topic Deleted");
	} catch (err) {
		console.log(err.message);
		res.status(500).send(err.message);
	}
});

module.exports = router;
