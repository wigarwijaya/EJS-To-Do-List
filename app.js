// install and require express
const express = require("express");
// install and require body-parser
const bodyParser = require("body-parser");
const ejs = require("ejs");

const date = require(__dirname + "/date.js");

const port = 3000;
const app = express();

// install and set EJS
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const items = [];
const workItems = [];

app.get("/", (req, res) => {
  const day = date.getDate();
  // res.render("<page we want to render>", variable we pass in is goin to be JS object {key: value})
  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", (req, res) => {
  console.log(req.body.list);
  const item = req.body.newItem;

  if (req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work")
  } else {
    items.push(item);
    res.redirect("/")
  }
})

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workItems })
})

app.get("/about", (req, res) => {
  res.render("about");
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
