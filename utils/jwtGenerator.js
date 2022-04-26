const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(userid, firstName, lastName, email) {
	const payload = {
		userid,
		firstName,
		lastName,
		email,
	};
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

module.exports = jwtGenerator;
