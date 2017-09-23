var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
    var hbsObj = {};
    res.render("index", hbsObj);
});

module.exports = router;