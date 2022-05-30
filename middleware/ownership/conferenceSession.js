const { pool } = require("../../database");
const logWritter = require("../../utils/logWritter");

module.exports = async (req, res, next) => {
	try {
		const { conferencesessionid } = req.params;

		const conference = await pool.query("SELECT * FROM conferencesessions WHERE conferencesessionid = $1", [conferencesessionid]);
		if (conference.rows.length === 0) {
			logWritter("conferenceSession", "get", req.userid, req.params.conferenceid, "fail");
			return res.status(404).json({
				message: "Conference session not found",
			});
		}

		const isOwner = await pool.query("SELECT * FROM conferences WHERE creatorid = $1 AND conferenceid = $2", [req.userid, conference.conferenceid]);
		const ischair = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2 AND ParticipationType = $3", [
			req.userid,
			conference.rows[0].conferenceid,
			"Chair",
		]);
		if (!ischair.rows[0] && !isOwner.rows[0]) {
			logWritter("conferenceSession", "get", req.userid, req.params.conferenceid, "fail");
			return res.status(403).json({
				message: "You are not authorized to perform actions on this conference Session",
			});
		}
		logWritter("conferenceSession", "get", req.userid, req.params.conferenceid, "success");
		next();
	} catch (err) {
		logWritter(`Unauthorized request on route ${req.path}`);
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
