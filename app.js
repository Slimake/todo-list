const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

let items = ["Soap", "Toothbrush", "Sponge"];

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
	let today = new Date();

	let options = {
		weekday: "short",
		day: "2-digit",
		month: "long",
	};

	let day = today.toLocaleDateString("en-US", options);

	res.render("list", {kindOfDay: day, newListItems: items});
});

app.post("/", function(req, res) {
	let item = req.body.newItem;

	if (item) {
		items.push(item);
	}

	res.redirect("/");
});

app.listen(3000, function() {
	console.log("Server started on port 3000") 
});