const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");

router.get("/:conferencesessionid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update a session
router.put("/:conferencesessionid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a session
router.delete("/:conferencesessionid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});
// get all topics for a session
router.get("/:conferencesessionid/topics", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// add a new topic
router.post("/:conferencesessionid/topics", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// updatea a topic
router.put("/:conferencesessionid/topics/:topicid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a topic
router.delete("/:conferencesessionid/topics/:topicid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all papers for a session
router.get("/:conferencesessionid/papers/", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// append a paper to a session
router.post("/:conferencesessionid/papers/", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// removes a paper from session. DOES NOT DELETE PAPER
router.delete("/:conferencesessionid/papers/:paperid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
