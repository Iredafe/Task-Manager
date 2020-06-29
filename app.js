const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/taskmanagerDB", {useNewUrlParser:true, useUnifiedTopology:true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model(
  "item", itemsSchema
);

const item1 = new Item({
  name: "make food"
});

const item2 = new Item({
  name: "go to work"
});

const item3 = new Item({
  name: "bathe baby"
});


const arr = [item1, item2, item3];

app.get("/", function(req, res){
  Item.find({}, function(err, foundItems){

    if(foundItems.length===0){
        Item.insertMany(arr, function(err){
              if(err){
              console.log(err);
                }else{
            console.log("Successfully saved to DB");
          }

        });
res.redirect("/")
      } else{
        res.render("list", {listTitle:"Today", newListItems:foundItems});  
        }    
  })

});

app.post("/", function(req, res){
console.log(req.body);
const item = req.body.newItem;
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

