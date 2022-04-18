const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		if (!token) {
			return res.status(401).json({
				message: "No token, authorization denied",
			});
		}
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userid = decoded.userid;
		next();
	} catch (err) {
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
