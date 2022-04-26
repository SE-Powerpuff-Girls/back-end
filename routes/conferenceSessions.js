const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");
const conferenSesessionIsOwner = require("../middleware/ownership/conferenceSession");

router.get("/:conferencesessionid", async (req, res) => {
	try {
		const { conferencesessionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM conferencesessions WHERE conferencesessionid = $1", [conferencesessionid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Conference session not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update a session
router.put("/:conferencesessionid", authorization, conferenSesessionIsOwner, async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a session
router.delete("/:conferencesessionid", authorization, conferenSesessionIsOwner, async (req, res) => {
	try {
		const { conferencesessionid } = req.params;
		const conferencesession = await pool.query("DELETE FROM conferencesessions WHERE conferencesessionid = $1 RETURNING *", [conferencesessionid]);
		if (conferencesession.rowCount === 0) {
			return res.status(404).json({
				message: "Conference session not found",
			});
		}
		return res.status(200).json({
			message: "Conference session deleted",
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});
// get all topics for a session
router.get("/:conferencesessionid/topics", async (req, res) => {
	try {
		const { conferencesessionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM conferencesessiontopics WHERE conferencesessionid = $1", [conferencesessionid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Conference session not found",
			});
		}
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// add a new topic
router.post("/:conferencesessionid/topics", authorization, conferenSesessionIsOwner, async (req, res) => {
	try {
		const { conferencesessionid } = req.params;
		const { text } = req.body;
		await pool.query("INSERT INTO conferencesessiontopics (conferencesessionid, text) VALUES ($1, $2)", [conferencesessionid, text]);
		return res.status(200).json({
			message: "Topic added",
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// updatea a topic
router.put("/:conferencesessionid/topics/:topicid", authorization, conferenSesessionIsOwner, async (req, res) => {
	try {
		const { text } = req.body;
		const topic = await pool.query("UPDATE conferencesessiontopics SET text = $1 WHERE topicid = $2 AND conferencesessionid = $3 RETURNING *", [
			text,
			req.params.topicid,
			req.params.conferencesessionid,
		]);
		if (topic.rows.length === 0) {
			return res.status(404).json({
				message: "Topic does not exist or you are not the owner of the conference session",
			});
		}
		return res.status(200).json({
			message: "Topic updated",
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a topic
router.delete("/:conferencesessionid/topics/:topicid", authorization, conferenSesessionIsOwner, async (req, res) => {
	try {
		const { conferencesessionid, topicid } = req.params;
		const topic = await pool.query("DELETE FROM conferencesessiontopics WHERE topicid = $1 AND conferencesessionid = $2 RETURNING *", [
			topicid,
			conferencesessionid,
		]);
		if (topic.rows.length === 0) {
			return res.status(404).json({
				message: "Topic does not exist or you are not the owner of the conference session",
			});
		}
		return res.status(200).json({
			message: "Topic deleted",
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all papers for a session
router.get("/:conferencesessionid/papers/", async (req, res) => {
	try {
		const { conferencesessionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM papers WHERE conferencesessionid = $1", [conferencesessionid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "No papers found on this session",
			});
		}
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// append a paper to a session
router.post("/:conferencesessionid/papers/", authorization, conferenSesessionIsOwner, async (req, res) => {
	try {
		const { conferencesessionid } = req.params;
		const { paperid } = req.body;
		const papers = await pool.query("UPDATE papers SET conferencesessionid = $1 WHERE paperid = $2 RETURNING *", [conferencesessionid, paperid]);
		if (papers.rows.length === 0) {
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		return res.status(200).json({
			message: "Paper added to session",
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// removes a paper from session. DOES NOT DELETE PAPER
router.delete("/:conferencesessionid/papers/:paperid", async (req, res) => {
	try {
		const { conferencesessionid, paperid } = req.params;
		const papers = await pool.query("UPDATE papers SET conferencesessionid = NULL WHERE paperid = $1 RETURNING *", [paperid]);
		if (papers.rows.length === 0) {
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		return res.status(200).json({
			message: "Paper removed from session",
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
