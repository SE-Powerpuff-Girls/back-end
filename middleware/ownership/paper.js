const { pool } = require("../../database");
const logWritter = require("../../utils/logWritter");

module.exports = async (req, res, next) => {
	try {
		const conference = await pool.query("SELECT * FROM papers WHERE paperid = $1", [req.params.paperid]);

		// get participation id
		let participationid = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2", [
			req.userid,
			conference.rows[0].conferenceid,
		]);
		participationid = participationid.rows[0].participationid;

		// check if user is author

		const isAuthor = await pool.query("SELECT * FROM authorstopaper WHERE paperid = $1 AND authorid = $2", [req.params.paperid, participationid]);

		// check if chair
		const isChair = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2 AND ParticipationType = $3", [
			req.userid,
			conference.rows[0].conferenceid,
			"Chair",
		]);
		// check if reviewer

		const isReviewer = await pool.query("SELECT * FROM ReviewersToPaper WHERE reviewerid = $1 AND paperid = $2", [
			participationid,
			req.params.paperid,
		]);
		if (!isAuthor.rows[0] && !isChair.rows[0] && !isReviewer.rows[0]) {
			logWritter("evaluation", "get", req.userid, req.params.evaluationid, "fail");
			return res.status(403).json({
				message: "You are not authorized to perform actions on this paper",
			});
		}
		logWritter("evaluation", "get", req.userid, req.params.evaluationid, "success");
		next();
	} catch (err) {
		logWritter(`Unauthorized request on route ${req.path}`);
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
