const router = require("express").Router();
const { pool } = require("../database");
const authorization = require("../middleware/authorization");

// get all conferences
router.get("/", async (req, res) => {
	try {
		console.log(1);
		const conferences = await pool.query("SELECT * FROM conferences");
		res.json(conferences.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create conference
router.post("/", authorization, async (req, res) => {
	try {
		const { name } = req.body;
		const conference = await pool.query("INSERT INTO conferences (name) VALUES ($1) RETURNING *", [name]);
		res.json(conference.rows[0] + " has been created by " + req.userid);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get one conference
router.get("/:conferenceid", async (req, res) => {
	console.log(1);
	try {
		const { conferenceid } = req.params;
		const conference = await pool.query("SELECT * FROM conferences WHERE conferenceid = $1", [conferenceid]);
		res.json(conference.rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update a conference
router.put("/:conferenceid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a conference
router.delete("/:conferenceid", async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all topics for a conference
router.get("/:conferenceid/topics", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// add a new topic
router.post("/:conferenceid/topics", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// updatea a topic
router.put("/:conferenceid/topics/:topicid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a topic
router.delete("/:conferenceid/topics/:topicid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all sessions for a conference
router.get("/:conferenceid/conferencesessions", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create a new seession into the conference
router.post("/:conferenceid/conferencesessions", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all participants for a conference

router.get("/:conferenceid/participants", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// add a new participant - should be called when a user registers for a conference
router.post("/:conferenceid/participants", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all the authors for a conference
router.get("/:conferenceid/participants/authors", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all the reviewers for a conference
router.get("/:conferenceid/participants/reviewers", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all the chairs for a conference
router.get("/:conferenceid/participants/chairs", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});
// get a specific participant to the conference. Should return User
router.get("/:conferenceid/participants/:participantid", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all papers for a conference
router.get("/:conferenceid/papers/", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create a new paper for a conference
router.post("/:conferenceid/papers/", async (req, res) => {
	try {
		res.json("Not Impemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
