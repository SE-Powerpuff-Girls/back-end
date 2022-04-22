const { pool } = require("../database");

module.exports = async (req, res, next) => {
	try {
		const userid = req.userid;
		const conferenceid = req.conferenceid;
		const user = await pool.query("SELECT * FROM participations WHERE userid = $1 AND conferenceid = $2", [userid, conferenceid]);

		if (user.rows.length === 0) {
			return res.status(401).json({
				message: "You are not authorized to access this resource",
			});
		}
		req.accessLevel = user.rows[0].type;
		next();
	} catch (err) {
		console.log(err.message);
		res.status(403).send("Not authorized");
	}
};
