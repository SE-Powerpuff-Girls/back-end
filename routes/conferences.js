const router = require("express").Router();
const { pool } = require("../database");
const authorization = require("../middleware/authorization");
const ownershipConference = require("../middleware/ownership/conference");
const multer = require("multer");
const addFile = require("../utils/fileUpload");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");
const logWritter = require("../utils/logWritter");

// get all conferences
router.get("/", async (req, res) => {
	try {
		const conferences = await pool.query("SELECT * FROM conferences");
		logWritter("got all conferences");
		res.status(200).json(conferences.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// create conference
router.post("/", authorization, upload, async (req, res) => {
	try {
		const { creatorid, name, url, subtitles, contactInformation } = req.body;
		let file_url = await addFile(req.file);
		if (file_url == null) {
			file_url = "";
		}
		const conference = await pool.query(
			"INSERT INTO conferences (creatorid, name, url, subtitles, contactinformation, photolink) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
			[creatorid, name, url, subtitles, contactInformation, file_url]
		);

		// // user authomaticall becomes chair
		await pool.query("INSERT INTO participations (userid, conferenceid, ParticipationType) VALUES ($1, $2, $3)", [
			req.userid,
			conference.rows[0].conferenceid,
			"Chair",
		]);
		logWritter("created conference", conference.rows[0].conferenceid);
		res.status(201).json(conference.rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
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
		if (conference.rowCount === 0) {
			logWritter("conference not found", conferenceid);
			return res.status(404).json({
				message: "Conference not found",
			});
		}
		logWritter("got one conference", conferenceid);
		res.status(200).json(conference.rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		logWritter("conference not found", req.params.conferenceid);
		res.status(500).send("Server error");
	}
});

// update a conference
router.put("/:conferenceid", authorization, ownershipConference, upload, async (req, res) => {
	try {
		const {
			name,
			url,
			subtitles,
			contactinformation,
			deadlinepapersubmission,
			deadlinepaperreview,
			deadlineacceptancenotification,
			deadlineacceptedpaperupload,
		} = req.body;
		const { conferenceid } = req.params;
		const conference = await pool.query("SELECT * FROM conferences WHERE conferenceid = $1", [conferenceid]);
		if (url == null) {
			url = conference.rows[0].url;
		}
		if (subtitles == null) {
			subtitles = conference.rows[0].subtitles;
		}
		if (contactinformation == null) {
			contactinformation = conference.rows[0].contactinformation;
		}
		if (deadlinepapersubmission == null) {
			deadlinepapersubmission = conference.rows[0].deadlinepapersubmission;
		}
		if (deadlinepaperreview == null) {
			deadlinepaperreview = conference.rows[0].deadlinepaperreview;
		}
		if (deadlineacceptancenotification == null) {
			deadlineacceptancenotification = conference.rows[0].deadlineacceptancenotification;
		}
		if (deadlineacceptedpaperupload == null) {
			deadlineacceptedpaperupload = conference.rows[0].deadlineacceptedpaperupload;
		}
		let file_url = await addFile(req.file);
		if (file_url == null) {
			file_url = "";
		}
		const update = await pool.query(
			"UPDATE conferences SET name = $1, url = $2, subtitles = $3, contactinformation = $4, deadlinepapersubmission = $5, deadlinepaperreview = $6, deadlineacceptancenotification = $7, deadlineacceptedpaperupload = $8, photolink = $9 WHERE conferenceid = $10 RETURNING *",
			[
				name,
				url,
				subtitles,
				contactinformation,
				deadlinepapersubmission,
				deadlinepaperreview,
				deadlineacceptancenotification,
				deadlineacceptedpaperupload,
				file_url,
				conferenceid,
			]
		);
		logWritter("updated conference", conferenceid);
		res.status(201).json(update.rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// delete a conference
router.delete("/:conferenceid", authorization, ownershipConference, async (req, res) => {
	try {
		const { conferenceid } = req.params;
		const conference = await pool.query("DELETE FROM conferences WHERE conferenceid = $1", [conferenceid]);
		res.status(200).send("Conference Deleted");
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all topics for a conference
router.get("/:conferenceid/topics", async (req, res) => {
	try {
		const { conferenceid } = req.params;
		const topics = await pool.query("SELECT * FROM conferencetopics WHERE conferenceid = $1", [conferenceid]);
		res.status(200).json(topics.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// add a new topic
router.post("/:conferenceid/topics", authorization, ownershipConference, async (req, res) => {
	try {
		const { conferenceid } = req.params;
		const { text } = req.body;
		const topic = await pool.query("INSERT INTO conferencetopics (conferenceid, text) VALUES ($1, $2) RETURNING *", [conferenceid, text]);
		res.status(201).json(topic.rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
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
		res.status(200).json(topic.rows[0].conferencetopicid + " has been deleted by " + req.userid);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all sessions for a conference
router.get("/:conferenceid/conferencesessions", async (req, res) => {
	try {
		const sessions = await pool.query("SELECT * FROM conferencesessions WHERE conferenceid = $1", [req.params.conferenceid]);
		if (sessions.rows.length === 0) {
			res.status(404).json("No sessions found");
		}
		res.status(200).json(sessions.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
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
		res.status(201).json(session.rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
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
		res.status(200).json(participants.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
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
		res.status(201).json(participant.rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
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
			res.status(404).json("No authors found");
		}
		res.status(200).json(authors.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
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
			res.status(404).json("No reviewers found");
		}
		res.status(200).json(reviewers.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
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
			res.status(404).json("No chairs found");
		}
		res.status(200).json(chairs.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
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
			res.status(404).json("No participant found");
		}
		// get user
		const user = await pool.query("SELECT * FROM Users WHERE userid = $1", [participant.rows[0].userid]);
		if (user.rows.length === 0) {
			res.status(404).json("Something went wrong");
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
		res.status(200).json(output);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all papers for a conference
router.get("/:conferenceid/papers/public", async (req, res) => {
	try {
		const papers = await pool.query("SELECT * FROM Papers WHERE conferenceid = $1 AND accepted = 'yes'", [req.params.conferenceid]);
		if (papers.rows.length === 0) {
			res.status(404).json("No papers found");
		}
		res.status(200).json(papers.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
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
			return res.status(403).json({
				message: "You are not a reviewer for this conference",
			});
		}
		const papers = await pool.query("SELECT * FROM Papers WHERE conferenceid = $1", [req.params.conferenceid]);
		if (papers.rows.length === 0) {
			res.status(404).json("No papers found");
		}
		res.status(200).json(papers.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:conferenceid/papers/author", authorization, async (req, res) => {
	try {
		const papersIds = await pool.query("SELECT paperid FROM authorstopapers WHERE userid = $1", [req.userid]);
		const papers = await pool.query("SELECT * FROM Papers WHERE paperid = ANY($1)", [papersIds.rows]);
		if (papers.rows.length === 0) {
			res.status(404).json("No papers found");
		}
		res.status(200).json(papers.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// create a new paper for a conference
router.post("/:conferenceid/papers/", authorization, async (req, res) => {
	try {
		const isAuthor = await pool.query("SELECT * FROM Participations WHERE userid = $1 AND conferenceid = $2 AND participationtype = 'Author'", [
			req.userid,
			req.params.conferenceid,
		]);
		if (isAuthor.rows.length === 0) {
			return res.status(403).json({
				message: "You are not an author for this conference",
			});
		}
		const newPaper = await pool.query("INSERT INTO papers (conferenceid) VALUES ($1) RETURNING *", [req.params.conferenceid]);
		const author = await pool.query("INSERT INTO authorstopapers (paperid, userid) VALUES ($1, $2)", [newPaper.rows[0].paperid, req.userid]);
		// append a random reviewer
		const reviewers = await pool.query("SELECT * FROM Participations WHERE conferenceid = $1 AND participationtype = 'Reviewer'", [
			req.params.conferenceid,
		]);
		if (reviewers.rows.length === 0) {
			return res.status(404).json({
				message: "No reviewers found",
			});
		}
		const reviewer = reviewers.rows[Math.floor(Math.random() * reviewers.rows.length)];
		const reviewerPaper = await pool.query("INSERT INTO reviewerstopapers (paperid, userid) VALUES ($1, $2)", [
			newPaper.rows[0].paperid,
			reviewer.userid,
		]);

		res.json(newPaper.rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
