var express = require("express");
var methodOverride = require("method-override");
var sanitizer = require("express-sanitizer");
var app= express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitizer());
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/blog_app");
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("blog", blogSchema);
app.get("/blogs",function(req, res){
    Blog.find({},function(err, blog){
       if(err){
           console.log("ERR!!");
       } else{
           res.render("index",{blog: blog});
       }
    });
});
app.get("/",function(req, res){
   res.redirect("blogs"); 
});
app.get("/blogs/new",function(req, res){
   res.render("new"); 
});
app.post("/blogs",function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog,function(err, newblog){
       if(err){
           console.log("ERR!!");
       }else{
           res.redirect("/blogs");
       }
   });
});
app.get("/blogs/:id",function(req, res){
    Blog.findById(req.params.id,function(err,foundblog){
         if(err){
             console.log("Oops error!!");
         }else{
             res.render("show",{blog: foundblog}); 
        }
     })
});
app.get("/blogs/:id/edit",function(req, res){
    Blog.findById(req.params.id,function(err, foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundblog});
        }
    });
});
app.put("/blogs/:id",function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedblog){
       if(err){
           res.redirect("/blogs");
       } else{
           res.redirect("/blogs/"+ req.params.id);
       }
    });
});
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err,removedblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
})
app.listen(process.env.PORT, process.env.IP,function(){
    console.log("Server has started!!");
});