const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");
const canSeePaperVersion = require("../middleware/ownership/paperVersion");
const logWritter = require("../utils/logWritter");

// get a paper version
router.get("/:paperversionid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM paperversions WHERE paperversionid = $1", [paperversionid]);
		if (rows.length === 0) {
			logWritter(`paper version ${paperversionid} not found`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		logWritter(`paper version ${paperversionid} found`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

router.delete("/:paperversionid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const paperversion = await pool.query("DELETE FROM paperversions WHERE paperversionid = $1 RETURNING *", [paperversionid]);
		if (paperversion.rowCount === 0) {
			logWritter(`paper version ${paperversionid} not found`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		logWritter(`paper version ${paperversionid} deleted`);
		return res.status(200).json({
			message: "Paper version deleted",
		});
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all keywords
router.get("/:paperversionid/keywords", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM keywords WHERE paperversionid = $1", [paperversionid]);
		// if (rows.length === 0) {
		// 	logWritter(`paper version ${paperversionid} has no keywords`);
		// 	return res.status(404).json({
		// 		message: "Paper version not found",
		// 	});
		// }
		logWritter(`paper version ${paperversionid} has keywords`);
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// create a keyword
router.post("/:paperversionid/keywords", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { keyword } = req.body;
		const { rows } = await pool.query("INSERT INTO keywords (paperversionid, text) VALUES ($1, $2) RETURNING *", [paperversionid, keyword]);
		if (rows.length === 0) {
			logWritter(`paper version ${paperversionid} not found`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		logWritter(`added keyword to paper version ${paperversionid}`);
		return res.status(201).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// delete a keyword
router.delete("/:paperversionid/keywords/:keywordid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid, keywordid } = req.params;
		const { rows } = await pool.query("DELETE FROM keywords WHERE paperversionid = $1 AND keywordid = $2 RETURNING *", [paperversionid, keywordid]);
		if (rows.length === 0) {
			logWritter(`paper version ${paperversionid} has no keywords`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		logWritter(`deleted keyword from paper version ${paperversionid}`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all topics for a paper version
router.get("/:paperversionid/topics", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM paperversiontopics WHERE paperversionid = $1", [paperversionid]);
		// if (rows.length === 0) {
		// 	logWritter(`paper version ${paperversionid} has no topics`);
		// 	return res.status(404).json({
		// 		message: "Paper version not found",
		// 	});
		// }
		logWritter(`paper version ${paperversionid} has topics`);
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// add a new topic
router.post("/:paperversionid/topics", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { topic } = req.body;
		const { rows } = await pool.query("INSERT INTO paperversiontopics (paperversionid, topic) VALUES ($1, $2) RETURNING *", [paperversionid, topic]);
		if (rows.length === 0) {
			logWritter(`paper version ${paperversionid} not found`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		logWritter(`added topic to paper version ${paperversionid}`);
		return res.status(201).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// delete a topic
router.delete("/:paperversionid/topics/:topicid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid, topicid } = req.params;
		const { rows } = await pool.query("DELETE FROM paperversiontopics WHERE paperversionid = $1 AND topicid = $2 RETURNING *", [
			paperversionid,
			topicid,
		]);
		if (rows.length === 0) {
			logWritter(`paper version ${paperversionid} has no topics`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		logWritter(`deleted topic from paper version ${paperversionid}`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all evaluations for a paper version
router.get("/:paperversionid/evaluations", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM evaluations WHERE paperversionid = $1", [paperversionid]);
		if (rows.length === 0) {
			logWritter(`paper version ${paperversionid} has no evaluations`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		logWritter(`paper version ${paperversionid} has evaluations`);
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});
// create a new evaluation
router.post("/:paperversionid/evaluations", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		//const { evaluation } = req.body;
		// get the paper
		const paper = await pool.query("SELECT * FROM papers WHERE paperid = (SELECT paperid FROM paperversions WHERE paperversionid = $1)", [
			paperversionid,
		]);
		if (paper.rows.length === 0) {
			logWritter(`paper version ${paperversionid} has no paper`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}

		// get the participation id
		const participation = await pool.query("SELECT participationid FROM participations WHERE userid = $1", [req.userid]);

		// get reviewerstopaper
		const reviewerstopaper = await pool.query("SELECT * FROM reviewerstopaper WHERE reviewerid = $1 AND paperid = $2", [
			participation.rows[0].participationid,
			paper.rows[0].paperid,
		]);
		const evaluations = await pool.query("INSERT INTO evaluations (paperversionid, reviewertopaperid) VALUES ($1, $2) RETURNING *", [
			paperversionid,
			reviewerstopaper.rows[0].reviewertopaperid,
		]);
		if (evaluations.rows.length === 0) {
			logWritter(`paper version ${paperversionid} not found`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		logWritter(`added evaluation to paper version ${paperversionid}`);
		return res.status(201).json(evaluations.rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get an evaluation
router.get("/:paperversionid/evaluations/:evaluationid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid, evaluationid } = req.params;
		const { rows } = await pool.query("SELECT * FROM evaluations WHERE paperversionid = $1 AND evaluationid = $2", [paperversionid, evaluationid]);
		if (rows.length === 0) {
			logWritter(`paper version ${paperversionid} has no evaluations`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		logWritter(`got evaluation from paper version ${paperversionid}`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:paperversionid/evaluations/:evaluationid/comments", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid, evaluationid } = req.params;
		const { rows } = await pool.query("SELECT * FROM comments WHERE paperversionid = $1 AND evaluationid=$1", [paperversionid, evaluationid]);
		if (rows.length === 0) {
			logWritter(`paper version ${paperversionid} has no evaluations`);
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		logWritter(`got evaluation from paper version ${paperversionid}`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:paperversionid/publiccomments", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM comments WHERE evaluationid IN (SELECT evaluationid from evaluations where paperversionid=$1)", [
			paperversionid,
		]);
		// if (rows.length === 0) {
		// 	logWritter(`paper version ${paperversionid} has no public comments`);
		// 	return res.status(404).json({
		// 		message: "Paper version not found",
		// 	});
		// }
		logWritter(`got public comments from paper version ${paperversionid}`);
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
