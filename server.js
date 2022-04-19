const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const { pool } = require("./database");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.set("port", process.env.PORT || 5000);

//API Endpoints
app.use("/auth", require("./routes/jwtAuth"));
app.use("/conferences", require("./routes/conference"));

// does not work properly
app.get("/papers/:conferenceid", async (req, res) => {
	try {
		let conferenceid = "bad3611a-5190-4d37-88f1-f9e0eac94918";

		const abcpapers = await pool.query("SELECT * FROM Papers WHERE conferenceid = $1", [conferenceid]);
		res.json(abcpapers.rows);
	} catch (err) {
		console.log(1);
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

// Starting server
app.listen(app.get("port"), function () {
	console.log(`Starting server on port ${app.get("port")}`);
});
