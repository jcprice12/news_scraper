var express = require("express");
var router = express.Router();
var request = require("request");
var cheerio = require("cheerio");
var Post = require("../models/Post.js");
var Comment = require("../models/Comment.js");

//recursive function to iterate through the articles found and save them to the mongo db
function nextInsert(articles, counter, results, res){
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
            return nextInsert(articles, (counter+1), results, res);
        });
    } else {
        res.json(results);
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

router.get("/", function(req, res) {
    var hbsObj = {};
    res.render("index", hbsObj);
});

router.get("/scrape", function(req, res){
    scrapeData().then(function(scrapedData){
        console.log("SCRAPED DATA");
        console.log(scrapedData);
        nextInsert(scrapedData,0,[],res);
    }).catch(function(err){
        console.log(err);
        res.status(500).send("Error while scraping new data. Please try again later");
    });
});

module.exports = router;