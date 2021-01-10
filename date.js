exports.getDate = function getDate() {

	const today = new Date();

	const options = {
		weekday: "short",
		day: "2-digit",
		month: "long",
	};

	const day = today.toLocaleDateString("en-US", options);
	return day;

}