const { pool } = require("./database");
const logWritter = require("../utils/logWritter");

module.exports = async (req, res, next) => {
	try {
		if (req.userid !== req.params.userid) {
			logWritter("user", "get", req.userid, req.params.userid, "fail");
			return res.status(403).json({
				message: "You are not authorized to perform actions on this user",
			});
		}
		logWritter("user", "get", req.userid, req.params.userid, "success");
		next();
	} catch (err) {
		logWritter(`Unauthorized request on route ${req.path}`);
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
