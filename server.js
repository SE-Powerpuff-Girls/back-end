const express = require("express");
const app = express();
app.set("port", process.env.PORT || 5000);

//API Endpoints
app.get("/users", (req, res) => {
	let users = ["ABC", "XYZ", "PQR"];
	res.send(users);
});

// Starting server
app.listen(app.get("port"), function () {
	console.log(`Starting server on port ${app.get("port")}`);
});
