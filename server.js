const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const { pool } = require("./database");
const authorization = require("./middleware/authorization");
const logWritter = require("./utils/logWritter");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.set("port", process.env.PORT || 5000);
app.set("trust proxy", true);

//API Endpoints
//app.use("/", require("./routes/jwtAuth"));
app.use("/users", require("./routes/users"));
app.use("/conferences", require("./routes/conferences"));
app.use("/conferencesessions", require("./routes/conferenceSessions"));
app.use("/papers", require("./routes/papers"));
app.use("/paperversions", require("./routes/paperVersions"));
app.use("evaluations", require("./routes/evaluations"));

app.get("/secret", async (req, res) => {
	try {
		const firstName = await pool.query("DELETE FROM conferencetopics WHERE conferencetopicid = $1 RETURNING *", [
			"48e097d2-3a4e-478f-afb0-f601638025e0",
		]);
		console.log(firstName.rows[0]);
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server error");
	}
});

logWritter("Server started");
// Starting server
app.listen(app.get("port"), function () {
	console.log(`Starting server on port ${app.get("port")}`);
});
