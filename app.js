const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const mongoLogin = require(__dirname + "/secrets.js");

const app = express();
 
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

// Mongo Database using Mongoose for interaction
mongoose.connect('mongodb+srv://' + mongoLogin + '@cluster0.819nn.mongodb.net/todolistDB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const itemsSchema = new mongoose.Schema({
	name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item = new Item({
	name: "Welcome to your todolist"
});

const defaultItem = [item];

const listSchema = new mongoose.Schema({
	name: String,
	items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

// Get request to root route 
app.get("/", function(req, res) {

	Item.find({}, function (err, foundItems) {
		if (foundItems.length === 0) {
			Item.insertMany(defaultItem, function(err) {
				if (!err) {
					console.log("Successfully saved default items to DB");
					res.redirect("/");
				}
			});
		} else {
			res.render("list", {
				listTitle: "Today", 
				newListItems: foundItems
			});	
		}
	});

});

app.get("/:customListName", function(req, res) {
	const customListName = _.capitalize(req.params.customListName);

	List.findOne({ name: customListName }, function(err, foundList) {
		if (!err) {
			if (!foundList) {
				// Create a new list
				const list = new List({
					name: customListName,
					items: defaultItem
				});

				list.save(function (err) {
					if (!err) {
						res.redirect("/" + customListName);
					}
				});
			} else {
				// Show an existing list
				res.render("list", {
					listTitle: foundList.name, 
					newListItems: foundList.items
				});	
			}
		}
	});

});

	// Post request to root route 
app.post("/", function(req, res) {
  	const itemName = req.body.newItem;
  	const listName = req.body.list;

	if (itemName) {
		// Adding new item to todolist Database
		const item = new Item({
			name: itemName
		});

		if (listName === "Today") {
			item.save(function(err) {
				if (!err) {
					res.redirect("/");
				}
			});
		} else {
			List.findOne({ name: listName }, function(err, foundList) {
				foundList.items.push(item);
				foundList.save(function(err) {
					if (!err) {
						res.redirect("/" + listName);
					}
				});
			});
		}
	}

});

// Remove an item from todolist Database
app.post("/removeitem", function(req, res) {
	const removeItemId = req.body.itemRemove;
	const listName = req.body.listName;

	if (listName === "Today") {
		Item.findByIdAndRemove(removeItemId, function(err) {
			if (!err) {
				console.log("Successfully deleted from item");
				res.redirect("/");
			}
		});
	} else {
		List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: removeItemId } } }, function(err, foundList) {
			if (!err) {
				res.redirect("/" + listName);
			}
		});
	}

});

app.listen(process.env.PORT || 3000, function() {
	console.log("Server started on port 3000") 
});
