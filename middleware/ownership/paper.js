const { pool } = require("../../database");
const logWritter = require("../../utils/logWritter");

module.exports = async (req, res, next) => {
	try {
		const conference = await pool.query("SELECT conferenceid FROM papers WHERE paperid = $1", [req.params.paperid]);

		if (conference.rows.length === 0) {
			return res.status(500).json({
				message: "Something went wrong, conference not found",
			});
		}
		const participation = await pool.query("SELECT participationid FROM participations WHERE userid = $1 AND conferenceid = $2", [
			req.userid,
			conference.rows[0].conferenceid,
		]);
		if (participation.rows.length === 0) {
			return res.status(403).json({
				message: "You are not a participant of this conference",
			});
		}
		let isOwner = await pool.query("SELECT * FROM papers WHERE creatorid = $1 AND paperid = $2", [
			participation.rows[0].participationid,
			req.params.paperid,
		]);
		let ischair = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2 AND ParticipationType = $3", [
			req.userid,
			conference.rows[0].conferenceid,
			"Chair",
		]);
		if (!ischair.rows[0] && !isOwner.rows[0]) {
			return res.status(403).json({
				message: "You are not authorized to perform actions on this paper",
			});
		}
		res.conferenceid = conference.rows[0].conferenceid;
		res.participationid = participation.rows[0].participationid;
		next();
	} catch (err) {
		logWritter(`${req.ip}  Unauthorized request on route ${req.path}`);
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
