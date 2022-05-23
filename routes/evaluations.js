const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");
const canSeeEvaluation = require("../middleware/ownership/evaluation");
const logWritter = require("../utils/logWritter");
// get an evaluation
router.get("/:evaluationid", authorization, canSeeEvaluation, async (req, res) => {
	try {
		const { evaluationid } = req.params;
		const { rows } = await pool.query("SELECT * FROM evaluations WHERE evaluationid = $1", [evaluationid]);
		if (rows.length === 0) {
			logWritter(`evaluation ${evaluationid} not found`);
			return res.status(404).json({
				message: "Evaluation not found",
			});
		}
		logWritter(`evaluation ${evaluationid} found`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// update an evaluation
router.put("/accept/:evaluationid", authorization, canSeeEvaluation, async (req, res) => {
	try {
		const { evaluationid } = req.params;
		const { rows } = await pool.query("UPDATE evaluations SET accepted = true WHERE evaluationid = $1 RETURNING *", [evaluationid]);
		if (rows.length === 0) {
			logWritter(`evaluation ${evaluationid} not found`);
			return res.status(404).json({
				message: "Evaluation not found",
			});
		}
		logWritter(`evaluation ${evaluationid} accepted`);
		return res.status(201).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

router.delete("/:evaluationid", authorization, canSeeEvaluation, async (req, res) => {
	try {
		const { evaluationid } = req.params;
		const evaluation = await pool.query("DELETE FROM evaluations WHERE evaluationid = $1 RETURNING *", [evaluationid]);
		if (evaluation.rowCount === 0) {
			logWritter(`evaluation ${evaluationid} not found`);
			return res.status(404).json({
				message: "Evaluation not found",
			});
		}
		logWritter(`evaluation ${evaluationid} deleted`);
		return res.status(200).json({
			message: "Evaluation deleted",
		});
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all comments in an evaluation

router.get("/:evaluationid/comments", authorization, canSeeEvaluation, async (req, res) => {
	try {
		const { evaluationid } = req.params;
		const { rows } = await pool.query("SELECT * FROM comments WHERE evaluationid = $1", [evaluationid]);
		if (rows.length === 0) {
			logWritter(`evaluation ${evaluationid} not found`);
			return res.status(404).json({
				message: "Evaluation not found",
			});
		}
		logWritter(`evaluation ${evaluationid} found`);
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// create a comment in an evaluation
router.post("/:evaluationid/comments", authorization, canSeeEvaluation, async (req, res) => {
	try {
		let { evaluationid } = req.params;
		let { comment } = req.body;
		const _comment = await pool.query("INSERT INTO comments (evaluationid, comment) VALUES ($1, $2) RETURNING *", [evaluationid, comment]);
		if (_comment.rowCount === 0) {
			logWritter(`evaluation ${evaluationid} not found`);
			return res.status(404).json({
				message: "Evaluation not found",
			});
		}
		logWritter(`comment ${_comment.rows[0].commentid} created in evaluation ${evaluationid}`);
		return res.status(201).json(_comment.rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// update a comment in an evaluation
router.put("/:evaluationid/comments/:commentid", authorization, canSeeEvaluation, async (req, res) => {
	try {
		let { commentid } = req.params;
		let { comment } = req.body;
		const { rows } = await pool.query("UPDATE comments SET comment = $1 WHERE commentid = $2", [comment, commentid]);
		if (rows.length === 0) {
			logWritter(`comment ${commentid} not found`);
			return res.status(404).json({
				message: "Comment not found",
			});
		}
		logWritter(`comment ${commentid} updated`);
		return res.status(201).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// delete a comment from an evaluation
router.delete("/:evaluationid/comments/:commentid", authorization, canSeeEvaluation, async (req, res) => {
	try {
		let { commentid } = req.params;
		const deleted = await pool.query("DELETE FROM comments WHERE commentid = $1", [commentid]);
		if (deleted.rowCount === 0) {
			logWritter(`comment ${commentid} not found`);
			return res.status(404).json({
				message: "Comment not found",
			});
		}
		logWritter(`comment ${commentid} deleted`);
		return res.status(200).json({
			message: "Comment deleted",
		});
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
