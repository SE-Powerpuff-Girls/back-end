const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");

// get a paper
router.get("/:paperid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// deletes a paper
router.delete("/:paperid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all authors for a paper
router.get("/:paperid/authors", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// append an author to a paper
router.post("/:paperid/authors", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// remove an author from a paper
router.delete("/:paperid/athors/:authorid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all reviewers for a paper
router.get("/:paperid/reviewers", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// append a reviewer to a paper
router.post("/:paperid/reviewers", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// remove a reviewer from a paper
router.delete("/:paperid/reviewers/:reviewerid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all conflicts for a paper
router.get("/:paperid/conflictofinterests", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create a conflict of itnerests
router.post("/:paperid/conflictofinterests", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get one conflict of itnerests
router.get("/:paperid/conflictofinterests/:conflictofinterestsid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update a conflict of itnerests
router.put("/:paperid/conflictofinterests/:conflictofinterestsid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a conflict of itnerests
router.delete("/:paperid/conflictofinterests/:conflictofinterestsid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all paper versions for a paper
router.get("/:paperid/paperversions", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create a paper version
router.post("/:paperid/paperversions", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
