const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
mongoose.set('useFindAndModify', false);
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

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("list", listSchema);


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
const itemName = req.body.newItem;
const listName = req.body.list;
const item = new Item({
  name: itemName
});

if(listName=== "Today"){
  item.save();
  res.redirect("/");
  
} else{
  List.findOne({name:listName}, function(err, foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirect("/" + listName);
   })
}

});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Successfully deleted the item");
        res.redirect("/");
             }
    });    
  }else{
    Item.findByIdAndRemove()
  }  
});

app.get("/:customListName", function(req, res){
const customListName= req.params.customListName;
List.findOne({name:customListName}, function(err, foundList){
  if (!err){
    if(!foundList){
//create a new list

const list = new List({
  name: customListName,
  items: arr
});
list.save();
res.redirect("/" + customListName);
}else{
      //show existing list
res.render("list", {listTitle: foundList.name, newListItems:foundList.items})

}
  }
})
});


app.get("/about", function(req, res){
  res.render("about");
})
app.listen(3000, function(){
  console.log("Server is running on Port 3000.");
})

