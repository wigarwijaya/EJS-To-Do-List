// install and require express
const express = require("express");
// install and require body-parser
const bodyParser = require("body-parser");
// install lodash
const _ = require("lodash");
// install monggose
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://wigarwijaya:Kamuband258@cluster0.hrurp8g.mongodb.net/todolistDB");
const { Schema } = mongoose;

const app = express();

// install and set EJS
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const itemsSchema = new Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the + button to add a new item",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item",
});

const defaultItems = [item1, item2, item3];

const listSchema = new Schema({
  name: String,
  items: [itemsSchema],
});

const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
  Item.find(function (err, docs) {
    // console.log(docs);
    if (docs.length === 0) {
      Item.insertMany(defaultItems, function (error) {
        if (error) {
          console.log(error);
        } else {
          // mongoose.connection.close();
          console.log("Successfully saved to a new db!");
        }
      });
      res.redirect("/");
    } else {
      // res.render("<page we want to render>", variable we pass in is goin to be JS object {key: value})
      res.render("list", { listTitle: "Today", newListItems: docs });
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // Create new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // Show an existing list
        res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
      }
    }
  });
});

app.post("/", (req, res) => {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  // console.log(req.body.checkbox);
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){
    Item.findByIdAndRemove(checkedItemID, (err) => {
      if (!err) {
        console.log("Item has been deleted");
        res.redirect("/");
      } 
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}, (err, foundList) =>{
      if (!err){
        res.redirect("/" + listName)
      }
    })
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }

// app.listen(port, () => {
//   console.log(`Server has started successfully.`);
// });

app.listen(process.env.PORT || 3000, function(){
  console.log(`Server has started successfully.`);
});