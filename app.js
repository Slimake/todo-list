const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");

const app = express();

const items = [];

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

	// Get request to root route 
app.get("/", function(req, res) {
	
	const day = date.getDate();

	res.render("list", {listTitle: day, newListItems: items});
});

	// Post request to root route 
app.post("/", function(req, res) {
	const item = req.body.newItem;

	if (item) {
		items.push(item);
	}

	res.redirect("/");
});

	// Remove an item from List
app.post("/removeitem", function(req, res) {
	const removeItem = req.body.itemRemove;

	items.splice(items.indexOf(removeItem), 1);
	res.redirect("/");

});

	
app.listen(process.env.PORT || 3000, function() {
	console.log("Server started on port 3000") 
});