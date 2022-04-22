const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const { pool } = require("./database");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.set("port", process.env.PORT || 5000);

//API Endpoints

app.use("/users", require("./routes/users"));
app.use("/conferences", require("./routes/conferences"));
app.use("/conferencesessions", require("./routes/conferenceSessions"));
app.use("/papers", require("./routes/papers"));
app.use("/paperversions", require("./routes/paperVersions"));
app.use("evaluations", require("./routes/evaluations"));

// Starting server
app.listen(app.get("port"), function () {
	console.log(`Starting server on port ${app.get("port")}`);
});
