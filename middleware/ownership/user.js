const { pool } = require("./database");
const logWritter = require("../utils/logWritter");

module.exports = async (req, res, next) => {
	try {
		if (req.userid !== req.params.userid) {
			return res.status(403).json({
				message: "You are not authorized to delete this user",
			});
		}
		next();
	} catch (err) {
		logWritter(`${req.ip}  Unauthorized request on route ${req.path}`);
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
