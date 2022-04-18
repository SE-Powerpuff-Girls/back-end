const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(userid) {
	const payload = {
		userid,
	};
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

module.exports = jwtGenerator;
