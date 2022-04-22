const fs = require("fs");

function logWritter(message) {
	const currentDate = new Date();
	const timestamp = currentDate.getTime();
	const timestampString = currentDate.toLocaleTimeString("en-CA", {
		year: "numeric",
		day: "numeric",
		month: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
		milisecond: true,
	});

	printData = `${timestampString}: ${message}\n`;
	fs.appendFile("./Logs.log", printData, function (err) {
		if (err) throw err;
	});
}

module.exports = logWritter;
