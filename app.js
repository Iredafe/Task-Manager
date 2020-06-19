const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

let items =[];
let workItems = [];

app.get("/", function(req, res){
let today = new Date();
let options= {
weekday: "long",
day: "numeric",
month: "long"
};

let day = today.toLocaleString("en-US", options);
res.render("list", {listTitle:day, newListItems:items});
});

app.post("/", function(req, res){
console.log(req.body);
let item = req.body.newItem;
if (req.body.list === "Work"){
  workItems.push(item);
  res.redirect("/work");
} else{
  items.push(item);
  res.redirect("/");
}

});

app.get("/work", function(req, res){
  res.render("list", {listTitle:"Work List", newListItems:workItems});
});


app.get("/about", function(req, res){
  res.render("about");
})
app.listen(3000, function(){
  console.log("Server is running on Port 3000.");
})
