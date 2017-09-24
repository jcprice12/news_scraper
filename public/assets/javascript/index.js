function removeArticle(id){
    $("#"+id).remove();
}

$(document).ready(function(){
    $(".save").click(function(){
        var articleToSave = $(this);
        var id = articleToSave.attr("data-article");
        $.ajax({
            url: "/interesting/" + id,
            method: "PUT",
            dataType: "json",
        }).done(function( dataBack ) {
            console.log(dataBack);
            if(dataBack.hasOwnProperty("error")){
                alert(dataBack.error);
            } else {
                removeArticle(id);
            }    
        });
    });

    $("#scrapeButton").click(function(){
        $.ajax({
            url: "/scrape",
            method : "GET",
            dataType: "json",
        }).done(function(dataBack){
            console.log(dataBack);
            if(dataBack.hasOwnProperty("error")){
                alert(dataBack.error);
            } else {
                if(dataBack.length > 0){
                    location.reload();
                } else {
                    alert("No new articles scraped.");
                }
            }
        });
    });
});