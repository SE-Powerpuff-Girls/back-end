const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");
const canSeePaperVersion = require("../middleware/ownership/paperVersion");
const res = require("express/lib/response");

// get a paper version
router.get("/:paperversionid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM paperversions WHERE paperversionid = $1", [paperversionid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update a paper version
router.put("/:paperversionid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		res.send("Not implemented");
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

router.delete("/:paperversionid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const paperversion = await pool.query("DELETE FROM paperversions WHERE paperversionid = $1 RETURNING *", [paperversionid]);
		if (paperversion.rowCount === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json({
			message: "Paper version deleted",
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all keywords
router.get("/:paperversionid/keywords", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM paperversionkeywords WHERE paperversionid = $1", [paperversionid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create a keyword
router.post("/:paperversionid/keywords", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { keyword } = req.body;
		const { rows } = await pool.query("INSERT INTO paperversionkeywords (paperversionid, keyword) VALUES ($1, $2) RETURNING *", [
			paperversionid,
			keyword,
		]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// update a keyword
router.put("/:paperversionid/keywords/:keywordid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid, keywordid } = req.params;
		const { keyword } = req.body;
		const { rows } = await pool.query("UPDATE paperversionkeywords SET keyword = $1 WHERE paperversionid = $2 AND keywordid = $3 RETURNING *", [
			keyword,
			paperversionid,
			keywordid,
		]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// delete a keyword
router.delete("/:paperversionid/keywords/:keywordid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid, keywordid } = req.params;
		const { rows } = await pool.query("DELETE FROM paperversionkeywords WHERE paperversionid = $1 AND keywordid = $2 RETURNING *", [
			paperversionid,
			keywordid,
		]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get all topics for a paper version
router.get("/:paperversionid/topics", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM paperversiontopics WHERE paperversionid = $1", [paperversionid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:paperversionid/topics", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM paperversiontopics WHERE paperversionid = $1", [paperversionid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
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
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// updatea a topic
router.put("/:paperversionid/topics/:topicid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid, topicid } = req.params;
		const { topic } = req.body;
		const { rows } = await pool.query("UPDATE paperversiontopics SET topic = $1 WHERE paperversionid = $2 AND topicid = $3 RETURNING *", [
			topic,
			paperversionid,
			topicid,
		]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
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
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});
// get all evaluations for a paper version
router.get("/:paperversionid/evaluations", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM evaluation WHERE paperversionid = $1", [paperversionid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});
// create a new evaluation
router.post("/:paperversionid/evaluations", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { evaluation } = req.body;
		const { rows } = await pool.query("INSERT INTO evaluation (paperversionid, evaluation) VALUES ($1, $2) RETURNING *", [
			paperversionid,
			evaluation,
		]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// get an evaluation
router.get("/:paperversionid/evaluations/:evaluationid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid, evaluationid } = req.params;
		const { rows } = await pool.query("SELECT * FROM evaluation WHERE paperversionid = $1 AND evaluationid = $2", [paperversionid, evaluationid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// create an evaluation
router.post("/:paperversionid/evaluations/:evaluationid", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid, evaluationid } = req.params;
		const { evaluation } = req.body;
		const { rows } = await pool.query("UPDATE evaluation SET evaluation = $1 WHERE paperversionid = $2 AND evaluationid = $3 RETURNING *", [
			evaluation,
			paperversionid,
			evaluationid,
		]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:paperversionid/publiccomments", authorization, canSeePaperVersion, async (req, res) => {
	try {
		const { paperversionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM commenta WHERE paperversionid = $1 AND public = TRUE", [paperversionid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Paper version not found",
			});
		}
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
