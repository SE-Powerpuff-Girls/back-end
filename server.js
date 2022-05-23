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

app.get("*", async (req, res) => {
	res.status(404).send("404 Not Found");
});

logWritter("Server started");
// Starting server
// exit codes
// 200 - OK
// 201 - Created
// 400 - Bad Request
// 401 - Unauthorized
// 403 - Forbidden
// 500 - Internal Server Error

app.listen(app.get("port"), function () {
	console.log(`Starting server on port ${app.get("port")}`);
});
