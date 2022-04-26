const { pool } = require("../../database");
const logWritter = require("../../utils/logWritter");

module.exports = async (req, res, next) => {
	try {
		const { conferencesessionid } = req.params;
		const { rows } = await pool.query("SELECT * FROM conferencesessions WHERE conferencesessionid = $1", [conferencesessionid]);
		if (rows.length === 0) {
			return res.status(404).json({
				message: "Conference session not found",
			});
		}
		const conference = await pool.query("SELECT conferenceid FROM conferencesessions WHERE conferencesessionid = $1", [
			req.params.conferencesessionid,
		]);

		if (conference.rows.length === 0) {
			return res.status(500).json({
				message: "Something went wrong",
			});
		}

		const isOwner = await pool.query("SELECT * FROM conferences WHERE creatorid = $1 AND conferenceid = $2", [
			req.userid,
			conference.rows[0].conferenceid,
		]);
		const ischair = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2 AND ParticipationType = $3", [
			req.userid,
			conference.rows[0].conferenceid,
			"Chair",
		]);
		if (!ischair.rows[0] && !isOwner.rows[0]) {
			return res.status(403).json({
				message: "You are not authorized to perform actions on this conference",
			});
		}
		next();
	} catch (err) {
		logWritter(`${req.ip}  Unauthorized request on route ${req.path}`);
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
