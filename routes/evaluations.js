const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");

// get an evaluation
router.get("/:evaluationid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update an evaluation
router.put("/:evaluationid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete an evaluation
router.delete("/:evaluationid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all comments in an evaluation

router.get("/:evaluationid/comments", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create a comment in an evaluation
router.post("/:evaluationid/comments", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update a comment in an evaluation
router.put("/:evaluationid/comments/:commentid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a comment from an evaluation
router.delete("/:evaluationid/comments/:commentid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
