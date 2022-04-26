const jwt = require("jsonwebtoken");
require("dotenv").config();
const logWritter = require("../utils/logWritter");

module.exports = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		if (!token) {
			logWritter(`${req.ip}  Unauthorized request on route ${req.path}`);
			return res.status(401).json({
				message: "No token, authorization denied",
			});
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userid = decoded.userid;
		logWritter(`${req.ip},  Authorized as user ${req.userid} for route ${req.path}`);
		next();
	} catch (err) {
		logWritter(`${req.ip}  Unauthorized request on route ${req.path}`);
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
