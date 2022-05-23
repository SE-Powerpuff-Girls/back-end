const { pool } = require("../../database");
const logWritter = require("../../utils/logWritter");

module.exports = async (req, res, next) => {
	try {
		// get paper version id
		const paperversionid = req.params.paperversionid;
		// get paper id
		const paperid = await pool.query("SELECT * FROM paperversions WHERE paperversionid = $1", [paperversionid]);
		paperid = paperid.rows[0].paperid;
		// get conference id
		const conferenceid = await pool.query("SELECT * FROM papers WHERE paperid = $1", [paperid]);
		conferenceid = conferenceid.rows[0].conferenceid;
		// get participation id
		const participationid = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2", [req.userid, conferenceid]);
		participationid = participationid.rows[0].participationid;
		// is chair
		const isChair = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2 AND ParticipationType = $3", [
			req.userid,
			conferenceid,
			"Chair",
		]);
		// is author
		const isAuthor = await pool.query("SELECT * FROM papers WHERE paperid = $1 AND authorid = $2", [paperid, participationid]);
		// is reviewer
		const isReviewer = await pool.query("SELECT * FROM ReviewersToPaper WHERE reviewerid = $1 AND paperid = $2", [participationid, paperid]);
		if (!isChair.rows[0] && !isAuthor.rows[0] && !isReviewer.rows[0]) {
			logWritter("paperversion", "get", req.userid, paperversionid, "fail");
			return res.status(403).json({
				message: "You are not authorized to perform actions on this paper version",
			});
		}
		logWritter("paperversion", "get", req.userid, paperversionid, "success");
		next();
	} catch (err) {
		logWritter(`${req.ip}  Unauthorized request on route ${req.path}`);
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
