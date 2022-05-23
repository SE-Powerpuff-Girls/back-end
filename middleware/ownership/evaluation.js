const { pool } = require("../../database");
const logWritter = require("../../utils/logWritter");

module.exports = async (req, res, next) => {
	try {
		//get papper version id from evaluation
		let paperversionid = await pool.query("SELECT * FROM evaluations WHERE evaluationid = $1", [req.params.evaluationid]);
		paperversionid = paperversionid.rows[0].paperversionid;
		// get paper from paper version
		let paperid = await pool.query("SELECT * FROM paperversions WHERE paperversionid = $1", [paperversionid]);
		paperid = paperid.rows[0].paperid;

		// get conference id from paper
		let conferenceid = await pool.query("SELECT * FROM papers WHERE paperid = $1", [paperid]);
		conferenceid = conferenceid.rows[0].conferenceid;

		// user must be either a reviewer of the paper, or the owner of the conference or the author
		// confert userid to participation id
		let participationid = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2", [req.userid, conferenceid]);
		participationid = participationid.rows[0].participationid;

		let isReviewer = await pool.query("SELECT * FROM ReviewersToPaper WHERE reviewerid = $1 AND paperid = $2", [participationid, paperid]);
		// is chair
		let isChair = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2 AND ParticipationType = $3", [
			req.userid,
			conferenceid,
			"Chair",
		]);
		// is author
		let isAuthor = await pool.query("SELECT * FROM papers WHERE paperid = $1 AND authorid = $2", [paperid, participationid]);

		if (!isChair.rows[0] && !isAuthor.rows[0] && !isReviewer.rows[0]) {
			logWritter("evaluation", "get", req.userid, req.params.evaluationid, "fail");
			return res.status(403).json({
				message: "You are not authorized to perform actions on this evaluation",
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
