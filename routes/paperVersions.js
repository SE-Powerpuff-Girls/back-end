const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");

// get a paper version
router.get("/:paperversionid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update a paper version
router.put("/:paperversionid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

router.delete("/:paperversionid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all keywords
router.get("/:paperversionid/keywords", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create a keyword
router.post("/:paperversionid/keywords", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update a keyword
router.put("/:paperversionid/keywords/:keywordid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a keyword
router.delete("/:paperversionid/keywords/:keywordid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all topics for a paper version
router.get("/:paperversionid/topics", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});
// get all topics for a conference
router.get("/:paperversionid/topics", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// add a new topic
router.post("/:paperversionid/topics", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// updatea a topic
router.put("/:paperversionid/topics/:topicid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a topic
router.delete("/:paperversionid/topics/:topicid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});
// get all evaluations for a paper version
router.get("/:paperversionid/evaluations", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});
// create a new evaluation
router.post("/:paperversionid/evaluations", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get an evaluation
router.get("/:paperversionid/evaluations/:evaluationid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create an evaluation
router.post("/:paperversionid/evaluations/:evaluationid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:paperversionid/publiccomments", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
