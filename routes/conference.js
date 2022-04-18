const router = require("express").Router();
const { pool } = require("../database");
const authorization = require("../middleware/authorization");

router.get("/", async (req, res) => {
	try {
		const conferences = await pool.query("SELECT * FROM conferences");
		res.json(conferences.rows);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

router.get("/:conferenceid", async (req, res) => {
	try {
		const { conferenceid } = req.params;
		const conference = await pool.query("SELECT * FROM conferences WHERE conferenceid = $1", [conferenceid]);
		res.json(conference.rows[0]);
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

// to create update conference routes
router.put("/:conferenceid/name", authorization, async (req, res) => {
	try {
		const { conferenceid } = req.params;
		const { name } = req.body;
		const conference = await pool.query("UPDATE conferences SET name = $1 WHERE conferenceid = $2 RETURNING *", [name, conferenceid]);
		res.json(conference.rows[0] + " has been updated by " + req.userid);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// does not work properly
router.get("/papers", async (req, res) => {
	try {
		let conferenceid = "0b20a365-b586-4892-b73e-b74825537d3a";
		const papers = await pool.query("SELECT * FROM papers WHERE conferenceid = $1", [conferenceid]);
		res.json(papers.rowCount);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
