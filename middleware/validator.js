module.exports = (req, res, next) => {
	const { email, password, firstName, lastName } = req.body;

	function validateEmail(userEmail) {
		const re =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(userEmail).toLowerCase());
	}

	if (req.path === "/register") {
		if (!email || !password || !firstName || !lastName) {
			return res.status(401).json({
				message: "Please fill out all fields",
			});
		}
		if (!validateEmail(email)) {
			return res.status(401).json({
				message: "Please enter a valid email",
			});
		}
		if (password.length < 8) {
			return res.status(401).json({
				message: "Password must be at least 8 characters",
			});
		}
	}

	if (req.path === "/login") {
		if (!email || !password) {
			return res.status(401).json({
				message: "Please fill out all fields",
			});
		}
		if (!validateEmail(email)) {
			return res.status(401).json({
				message: "Please enter a valid email",
			});
		}
		if (password.length < 8) {
			return res.status(401).json({
				message: "Password must be at least 8 characters",
			});
		}
	}
	next();
};
