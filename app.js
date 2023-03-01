const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended : true}));

mongoose.set('strictQuery',true);
mongoose.connect("mongodb://0.0.0.0:27017/wikiDB");


const articleSchema = {
    title: String,
    content: String
}

const Article = new mongoose.model("Article",articleSchema);


// Targeting common request

app.route("/articles")
.get(function(req,res){
    Article.find()   // no longer accepting callbacks
})
.post(function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err){
        if(!err){
            console.log("Successfully added new data entry!");
        }
        else{
            console.log(err);
        }
    });
})
.delete(function(req,res){
    Article.deleteMany()    // no longer accepting callbacks
  });


  // Targeting a specific request
  app.route("/articles/:articleTitle")
  .get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("Not Found!")
        }
    })
  })

  // used to update the title and the data field
  .put(function(req,res){
    Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
        if(!err){
            res.send("Successfully updated!")
        }
    }
    )
})
 // used to update a particular data field
 .patch(function(req,res){
    Article.update(
        {title: req.params.title},
        {$set : req.body},
        function(err){
            if(!err){
                res.send("Successfully updated article!");
            }
            else{
                res.send(err);
            }
        }
    )
 })

 .delete(function(req,res){
    Article.deleteOne(
        {title: req.params.title},
        function(err){
            if(!err){
                res.send("Successfully deleted!");
            }
            else{
                res.send(err)
            }
        }
    );
 });


app.listen(3000,function(req,res){
    console.log("Server is listeneing on port 3000!");
})