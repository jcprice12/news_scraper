var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var Post = require("../models/Post.js");
var Comment = require("../models/Comment.js");

//recursive function to iterate through the articles found and save them to the mongo db
function nextInsert(articles, counter, results, cb){
    if(counter < articles.length){
        var post = articles[counter];
        post.save(function(err, newPost){
            if(err){
                console.log(err);
            } else {
                console.log("New Post");
                console.log(newPost);
                results.push(newPost);
            }
            return nextInsert(articles, (counter+1), results, cb);
        });
    } else {
        cb(results);
    }
}

function scrapeData(){
    var promise = new Promise(function(resolve, reject){
        request("https://www.theplayerstribune.com/", function(error, response, html) {
            if(error){
                reject(error);
            } else {
                var results = [];
                // Load the HTML into cheerio and save it to a variable
                var $ = cheerio.load(html);
                // Select each element in the HTML body from which I want info
                var articlesCont = $("#main").find(".homepage-articles");
                //get array of article elements
                var articles = $(articlesCont).children("article");
                articles.each(function(i, element){
                    var content = $(element).find(".entry-content");
                    var aTag = $(content).find("h2").find("a");
                    var heading = $(aTag).text();
                    var articleLink = $(aTag).attr("href");
                    var body = content.find("p").text();
                    var post = new Post({
                        "title": heading,
                        "link": articleLink,
                        "summary": body, 
                    });
                    results.push(post);
                });
                console.log(results);
                resolve(results);
            }
        });
    });
    return promise;
}

router.get("/scrape", function(req, res){
    scrapeData().then(function(scrapedData){
        console.log("SCRAPED DATA");
        console.log(scrapedData);
        nextInsert(scrapedData,0,[],function(results){
            res.json(results);
        });
    }).catch(function(err){
        console.log(err);
        res.status(500).send("Error while scraping new data. Please try again later.");
    });
});

router.get("/interesting", function(req, res){
    Post.find({interesting: true}).populate("comments").exec(function(error, articles){
        if(error){
            res.status(500).send("Error while getting intersting articles from the database. Please try again later");
        } else {
            var hbsObj = {
                "articles" : articles
            };
            res.render("interesting", hbsObj);
        }
    });
});

router.put("/interesting/:id", function(req, res){
    Post.findByIdAndUpdate(req.params.id, { $set: { interesting: true }}, function (err, article) {
        if (err){
            res.json({
                "error" : "Error updating article. Please try again later."
            });
        } else {
            res.json(article)
        }
    });
});

router.put("/uninteresting/:id", function(req, res){
    Post.findByIdAndUpdate(req.params.id, { $set: { interesting: false }}, function (err, article) {
        if (err){
            res.json({
                "error" : "Error updating article. Please try again later."
            });
        } else {
            res.json(article)
        }
    });
});

//id refers to the article id
router.post("/comments/:id", function(req, res){
    console.log("found the route to comment");
    Post.findOne({_id : req.params.id}, function(errPost, post){
        if(errPost){
            console.log(errPost);
            res.status(500).send("Error getting article to comment on. Please try again later.")
        } else {
            console.log("Creating new comment");
            var comment = new Comment({
                text : req.body.commentText,
                poster: req.body.commentPoster,
                likes: 0,
            });
            comment.save(function(err, newComment){
                if(err){
                    console.log(err);
                    res.status(500).send("Error posting comment. Please try again later.");
                } else {
                    console.log("Saving new comment");
                    post.comments.push(newComment._id);
                    post.save(function(errSave, savedPost){
                        if(errSave){
                            console.log(errSave);
                            res.status(500).send("Error assigning comment to article.");
                        } else {
                            console.log("comment creation successful");
                            res.redirect("/interesting");
                        }
                    });
                }
            });
        }
    });
});

router.delete("/comment/:id", function(req, res){
    console.log("found delete path");
    Comment.findOne({_id : req.params.id}, function(err, comment){
        if(err){
            console.log(err);
            res.status(500).send("Error finding comment to delete. Please try again later.");
        } else {
            console.log("found comment");
            comment.remove(function(errRemove){
                if(errRemove){
                    console.log(errRemove);
                    res.status(500).send("Error deleting comment. Please try again later.");
                } else {
                    res.json({"redirect" : "/interesting"});
                }
            });
        }
    });
});

router.get("/", function(req, res) {
    scrapeData().then(function(scrapedData){
        console.log("SCRAPED DATA");
        console.log(scrapedData);
        nextInsert(scrapedData, 0, [], function(results){
            //results is not needed in this case
            Post.find({interesting: false}, function(error, articles){
                if(error){
                    res.status(500).send("Error while getting articles from the database");
                } else {
                    var hbsObj = {
                        "articles" : articles
                    };
                    res.render("index", hbsObj);
                }
            }); 
        });
    }).catch(function(error){
        res.status(500).send("Error while scraping new data. Please try again later.");
    });
});

module.exports = router;