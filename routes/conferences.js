const router = require("express").Router();
const { pool } = require("../database");
const authorization = require("../middleware/authorization");
const ownershipConference = require("../middleware/ownership/conference");

// get all conferences
router.get("/", async (req, res) => {
	try {
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
		const conference = await pool.query("INSERT INTO conferences (name, creatorid) VALUES ($1, $2) RETURNING *", [name, req.userid]);
		// user authomaticall becomes chair
		await pool.query("INSERT INTO participations (userid, conferenceid, ParticipationType) VALUES ($1, $2, $3)", [
			req.userid,
			conference.rows[0].conferenceid,
			"Chair",
		]);
		res.json(conference.rows[0].conferenceid + " has been created by " + req.userid);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get one conference
router.get("/:conferenceid", async (req, res) => {
	console.log(req.params);
	console.log(req.conferenceid);
	console.log(req.body);
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
router.put("/:conferenceid", authorization, ownershipConference, async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a conference
router.delete("/:conferenceid", authorization, ownershipConference, async (req, res) => {
	try {
		const { conferenceid } = req.params;
		const conference = await pool.query("DELETE FROM conferences WHERE conferenceid = $1", [conferenceid]);
		res.send("Conference Deleted");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all topics for a conference
router.get("/:conferenceid/topics", async (req, res) => {
	try {
		const { conferenceid } = req.params;
		const topics = await pool.query("SELECT * FROM conferencetopics WHERE conferenceid = $1", [conferenceid]);
		output = [];
		topics.rows.forEach((topic) => {
			output.push({
				text: topic.text,
			});
		});
		res.json(output);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// add a new topic
router.post("/:conferenceid/topics", authorization, ownershipConference, async (req, res) => {
	try {
		const { conferenceid } = req.params;
		const { text } = req.body;
		const topic = await pool.query("INSERT INTO conferencetopics (conferenceid, text) VALUES ($1, $2) RETURNING *", [conferenceid, text]);
		res.json(topic.rows[0].conferencetopicid + " has been created by " + req.userid);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update a topic
router.put("/:conferenceid/topics/:topicid", authorization, ownershipConference, async (req, res) => {
	try {
		const { text } = req.body;
		const topic = await pool.query("UPDATE conferencetopics SET text = $1 WHERE topicid = $2 AND conferenceid = $3 RETURNING *", [
			text,
			req.params.topicid,
			req.params.conferenceid,
		]);
		if (topic.rows.length === 0) {
			return res.status(404).json({
				message: "Topic does not exist or you are not the owner",
			});
		}
		res.json(topic.rows[0].conferencetopicid + " has been updated by " + req.userid);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a topic
router.delete("/:conferenceid/topics/:topicid", authorization, ownershipConference, async (req, res) => {
	try {
		const { topicid } = req.params;
		const topic = await pool.query("DELETE FROM conferencetopics WHERE topicid = $1 AND conferenceid = $2", [topicid, req.params.conferenceid]);
		if (topic.rows.length === 0) {
			return res.status(404).json({
				message: "Topic does not exist or you are not the owner",
			});
		}
		res.json(topic.rows[0].conferencetopicid + " has been deleted by " + req.userid);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all sessions for a conference
router.get("/:conferenceid/conferencesessions", async (req, res) => {
	try {
		const sessions = await pool.query("SELECT * FROM conferencesessions WHERE conferenceid = $1", [req.params.conferenceid]);
		if (sessions.rows.length === 0) {
			res.json("No sessions found");
		}
		res.json(sessions.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create a new seession into the conference
router.post("/:conferenceid/conferencesessions", authorization, ownershipConference, async (req, res) => {
	try {
		// name, description, conferenceid
		const { name, description } = req.body;
		const session = await pool.query("INSERT INTO conferencesessions (name, description, conferenceid) VALUES ($1, $2, $3) RETURNING *", [
			name,
			description,
			req.params.conferenceid,
		]);
		res.json(session.rows[0].conferencesessionid + " has been created by " + req.userid);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all participants for a conference

router.get("/:conferenceid/participants", async (req, res) => {
	try {
		const participants = await pool.query("SELECT * FROM Participations WHERE conferenceid = $1", [req.params.conferenceid]);
		if (participants.rows.length === 0) {
			res.json("No participants found");
		}
		res.json(participants.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// add a new participant - should be called when a user registers for a conference
router.post("/:conferenceid/participants", authorization, async (req, res) => {
	try {
		const { userid, participationType } = req.userid;
		const { conferenceid } = req.params;
		if (!(participationType === "Author" || participationType === "Reviewer")) {
			return res.status(400).json({
				message: "Participation type must be either Author or Reviewer",
			});
		}
		const participant = await pool.query("INSERT INTO Participations (userid, conferenceid, participationtype) VALUES ($1, $2, $3) RETURNING *", [
			userid,
			conferenceid,
			participationType,
		]);
		res.json(participant.rows[0].participationid + " has been created by " + req.userid);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all the authors for a conference
router.get("/:conferenceid/participants/authors", async (req, res) => {
	try {
		const authors = await pool.query("SELECT * FROM Participations WHERE conferenceid = $1 AND participationtype = 'Author'", [
			req.params.conferenceid,
		]);
		if (authors.rows.length === 0) {
			res.json("No authors found");
		}
		res.json(authors.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all the reviewers for a conference
router.get("/:conferenceid/participants/reviewers", async (req, res) => {
	try {
		const reviewers = await pool.query("SELECT * FROM Participations WHERE conferenceid = $1 AND participationtype = 'Reviewer'", [
			req.params.conferenceid,
		]);
		if (reviewers.rows.length === 0) {
			res.json("No reviewers found");
		}
		res.json(reviewers.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all the chairs for a conference
router.get("/:conferenceid/participants/chairs", async (req, res) => {
	try {
		const chairs = await pool.query("SELECT * FROM Participations WHERE conferenceid = $1 AND participationtype = 'Chair'", [
			req.params.conferenceid,
		]);
		if (chairs.rows.length === 0) {
			res.json("No chairs found");
		}
		res.json(chairs.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get a specific participant to the conference. Should return User
router.get("/:conferenceid/participants/:participantid", async (req, res) => {
	try {
		const participant = await pool.query("SELECT * FROM Participations WHERE conferenceid = $1 AND participantid = $2", [
			req.params.conferenceid,
			req.params.participantid,
		]);
		if (participant.rows.length === 0) {
			res.json("No participant found");
		}
		// get user
		const user = await pool.query("SELECT * FROM Users WHERE userid = $1", [participant.rows[0].userid]);
		if (user.rows.length === 0) {
			res.status(500).json("Something went wrong");
		}
		output = {
			userid: user.rows[0].userid,
			firstname: user.rows[0].firstname,
			lastname: user.rows[0].lastname,
			email: user.rows[0].email,
			title: user.rows[0].title,
			gender: user.rows[0].gender,
			nationality: user.rows[0].nationality,
			adress: user.rows[0].adress,
			photolink: user.rows[0].photolink,
		};
		res.json(output);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all papers for a conference
router.get("/:conferenceid/papers/public", async (req, res) => {
	try {
		const papers = await pool.query("SELECT * FROM Papers WHERE conferenceid = $1 AND accepted = 'yes'", [req.params.conferenceid]);
		if (papers.rows.length === 0) {
			res.json("No papers found");
		}
		res.json(papers.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:conferenceid/papers/reviewer", authorization, async (req, res) => {
	try {
		const isReviewer = await pool.query(
			"SELECT * FROM Participations WHERE userid = $1 AND conferenceid = $2 AND participationtype = 'Reviewer' OR participationtype='Chair'",
			[req.userid, req.params.conferenceid]
		);
		if (isReviewer.rows.length === 0) {
			return res.status(400).json({
				message: "You are not a reviewer for this conference",
			});
		}
		const papers = await pool.query("SELECT * FROM Papers WHERE conferenceid = $1", [req.params.conferenceid]);
		if (papers.rows.length === 0) {
			res.json("No papers found");
		}
		res.json(papers.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:conferenceid/papers/author", authorization, async (req, res) => {
	try {
		const papersIds = await pool.query("SELECT paperid FROM authorstopapers WHERE userid = $1", [req.userid]);
		const papers = await pool.query("SELECT * FROM Papers WHERE paperid = ANY($1)", [papersIds.rows]);
		if (papers.rows.length === 0) {
			res.json("No papers found");
		}
		res.json(papers.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});
// create a new paper for a conference
router.post("/:conferenceid/papers/", async (req, res) => {
	try {
		const isAuthor = await pool.query("SELECT * FROM Participations WHERE userid = $1 AND conferenceid = $2 AND participationtype = 'Author'", [
			req.userid,
			req.params.conferenceid,
		]);
		if (isAuthor.rows.length === 0) {
			return res.status(400).json({
				message: "You are not an author for this conference",
			});
		}
		const newPaper = await pool.query("INSERT INTO papers (conferenceid) VALUES ($1) RETURNING *", [req.params.conferenceid]);
		const author = await pool.query("INSERT INTO authorstopapers (paperid, userid) VALUES ($1, $2)", [newPaper.rows[0].paperid, req.userid]);
		res.json(newPaper.rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
