const { pool } = require("../../database");
const logWritter = require("../../utils/logWritter");

module.exports = async (req, res, next) => {
	try {
		// creator id is the user id

		let isOwner = await pool.query("SELECT * FROM conferences WHERE creatorid = $1 AND conferenceid = $2", [req.userid, req.params.conferenceid]);
		let ischair = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2 AND ParticipationType = $3", [
			req.userid,
			req.params.conferenceid,
			"Chair",
		]);
		if (!ischair.rows[0] && !isOwner.rows[0]) {
			logWritter("conference", "get", req.userid, req.params.conferenceid, "fail");
			return res.status(403).json({
				message: "You are not authorized to perform actions on this conference",
			});
		}
		logWritter("conference", "get", req.userid, req.params.conferenceid, "success");
		next();
	} catch (err) {
		logWritter(`Unauthorized request on route ${req.path}`);
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
