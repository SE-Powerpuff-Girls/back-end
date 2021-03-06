const router = require("express").Router();
const bcrypt = require("bcrypt");
const { pool } = require("../database");
const jwtGenerator = require("../utils/jwtGenerator");
const validator = require("../middleware/validator");
const authorization = require("../middleware/authorization");
const hasPaperAccess = require("../middleware/ownership/paper");
const multer = require("multer");
const addFile = require("../utils/fileUpload");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");
const logWritter = require("../utils/logWritter");
const paper = require("../middleware/ownership/paper");
// get a paper
router.get("/:paperid", authorization, hasPaperAccess, async (req, res) => {
	try {
		const { paperid } = req.params;
		const { rows } = await pool.query("SELECT * FROM papers WHERE paperid = $1", [paperid]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`paper ${paperid} found`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

//accept a paper
router.put("/accept/:paperid", authorization, async (req, res) => {
	try {
		const { paperid } = req.params;
		const { rows } = await pool.query("UPDATE papers SET accepted ='t' WHERE paperid = $1 RETURNING *", [paperid]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`paper ${paperid} accepted`);
		return res.status(201).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// deletes a paper
router.delete("/:paperid", authorization, hasPaperAccess, async (req, res) => {
	try {
		const { paperid } = req.params;
		const paper = await pool.query("DELETE FROM papers WHERE paperid = $1 RETURNING *", [paperid]);
		if (paper.rowCount === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`paper ${paperid} deleted`);
		return res.status(200).json({
			message: "Paper deleted",
		});
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all authors for a paper
router.get("/:paperid/authors", async (req, res) => {
	try {
		const { paperid } = req.params;
		const users = await pool.query("SELECT * FROM authorstopaper WHERE paperid = $1", [paperid]);
		if (users.rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`got authors for paper ${paperid}`);
		return res.status(200).json(users);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:paperid/authors/names", async (req, res) => {
	try {
		const { paperid } = req.params;
		const authors = await pool.query(
			"SELECT firstname, lastname FROM users where userid = (SELECT userid FROM participations where participationid = (SELECT authorid FROM authorstopaper WHERE paperid = $1))",
			[paperid]
		);
		if (authors.rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`got authors for paper ${paperid}`);
		return res.status(200).json(authors.rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// append an author to a paper
router.post("/:paperid/authors", authorization, hasPaperAccess, async (req, res) => {
	try {
		const { paperid } = req.params;
		const { authorid } = req.body;
		const { rows } = await pool.query("INSERT INTO authorstopaper (paperid, authorid) VALUES ($1, $2) RETURNING *", [paperid, authorid]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`appended author ${authorid} to paper ${paperid}`);
		return res.status(201).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// remove an author from a paper
router.delete("/:paperid/athors/:authorid", authorization, hasPaperAccess, async (req, res) => {
	try {
		const { paperid, authorid } = req.params;
		const { rows } = await pool.query("DELETE FROM authorstopaper WHERE paperid = $1 AND authorid = $2 RETURNING *", [paperid, authorid]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`removed author ${authorid} from paper ${paperid}`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all reviewers for a paper
router.get("/:paperid/reviewers", async (req, res) => {
	try {
		const { paperid } = req.params;
		const { rows } = await pool.query("SELECT * FROM reviewerstopaper WHERE paperid = $1", [paperid]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`got reviewers for paper ${paperid}`);
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// append a reviewer to a paper
router.post("/:paperid/reviewers", authorization, async (req, res) => {
	try {
		const { paperid } = req.params;
		const { reviewerid } = req.body;
		const { rows } = await pool.query("INSERT INTO reviewerstopaper (paperid, reviewerid) VALUES ($1, $2) RETURNING *", [paperid, reviewerid]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`appended reviewer ${reviewerid} to paper ${paperid}`);
		return res.status(201).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// remove a reviewer from a paper
router.delete("/:paperid/reviewers/:reviewerid", async (req, res) => {
	try {
		const { paperid, reviewerid } = req.params;
		const { rows } = await pool.query("DELETE FROM reviewerstopaper WHERE paperid = $1 AND reviewerid = $2 RETURNING *", [paperid, reviewerid]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`removed reviewer ${reviewerid} from paper ${paperid}`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all conflicts for a paper
router.get("/:paperid/conflictofinterests", async (req, res) => {
	try {
		const { paperid } = req.params;
		const { rows } = await pool.query("SELECT * FROM conflictofinterests WHERE paperid = $1", [paperid]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`got conflicts for paper ${paperid}`);
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// create a conflict of itnerests
router.post("/:paperid/conflictofinterests", authorization, async (req, res) => {
	try {
		const { paperid } = req.params;
		const { reviewerID, description } = req.body;
		const conferenceid = await pool.query("SELECT conferenceid FROM papers where paperid=$1", [paperid]);
		const participationid = await pool.query("SELECT participationid FROM participations where userid=$1 and conferenceid=$2", [
			reviewerID,
			conferenceid.rows[0].conferenceid,
		]);
		const { rows } = await pool.query("INSERT INTO conflictofinterests (paperid, reviewerid, description) VALUES ($1, $2, $3) RETURNING *", [
			paperid,
			participationid.rows[0].participationid,
			description,
		]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`appended conflict of interest ${reviewerID} to paper ${paperid}`);
		return res.status(201).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get one conflict of itnerests
router.get("/:paperid/conflictofinterests/:conflictofinterestsid", async (req, res) => {
	try {
		const { paperid, conflictofinterestsid } = req.params;
		const { rows } = await pool.query("SELECT * FROM conflictofinterests WHERE paperid = $1 AND conflictofinterestsid = $2", [
			paperid,
			conflictofinterestsid,
		]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`got conflict of interest ${conflictofinterestsid} for paper ${paperid}`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// delete a conflict of interests
router.delete("/:paperid/conflictofinterests/:conflictofinterestsid", authorization, hasPaperAccess, async (req, res) => {
	try {
		const { paperid, conflictofinterestsid } = req.params;
		const { rows } = await pool.query("DELETE FROM conflictofinterests WHERE paperid = $1 AND conflictofinterestsid = $2 RETURNING *", [
			paperid,
			conflictofinterestsid,
		]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`removed conflict of interest ${conflictofinterestsid} from paper ${paperid}`);
		return res.status(200).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// get all paper versions for a paper
router.get("/:paperid/paperversions", authorization, hasPaperAccess, async (req, res) => {
	try {
		const { paperid } = req.params;
		const { rows } = await pool.query("SELECT * FROM paperversions WHERE paperid = $1 ORDER BY submittedat DESC", [paperid]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		logWritter(`got paper versions for paper ${paperid}`);
		return res.status(200).json(rows);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

// create a paper version
router.post("/:paperid/paperversions", authorization, hasPaperAccess, upload, async (req, res) => {
	try {
		const { paperid } = req.params;
		const { title, abstract } = req.body;
		const url = await addFile(req.file);
		if (url == null) {
			url = "";
		}
		const { rows } = await pool.query("INSERT INTO paperversions (paperid, title, abstract, documentlink) VALUES ($1, $2, $3, $4) RETURNING *", [
			paperid,
			title,
			abstract,
			url,
		]);
		if (rows.length === 0) {
			logWritter(`paper ${paperid} not found`);
			return res.status(404).json({
				message: "Paper not found",
			});
		}
		//set current version to the new version
		const { rows: rows2 } = await pool.query("UPDATE papers SET currentversion = $1 WHERE paperid = $2 RETURNING *", [
			rows[0].paperversionid,
			paperid,
		]);
		logWritter(`created paper version ${rows[0].paperversionid} for paper ${paperid}`);
		res.status(201).json(rows[0]);
	} catch (err) {
		console.log(err.message);
		logWritter(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
