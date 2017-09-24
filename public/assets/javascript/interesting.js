function removeArticle(id){
    $("#"+id).remove();
}

$(document).ready(function(){
    $(".uninteresting").click(function(){
        var articleToRemove = $(this);
        var id = articleToRemove.attr("data-article");
        $.ajax({
            url: "/uninteresting/" + id,
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

    $(".delete").click(function(){
        var id=$(this).attr("data-delete-comment");
        $.ajax({
            url: "/comment/" + id,
            type: "DELETE",
        }).done(function( dataBack ) {
            if(dataBack.hasOwnProperty("redirect")){
                window.location = dataBack.redirect
            }
        });
    });

    // $(".commentForm").submit(function(event){
    //     event.preventDefault();
    //     var commentPoster = $(this).find(".posterInput").val().trim();
    //     var commentText = $(this).find("textarea").val().trim();
    //     console.log(commentPoster);
    //     console.log(commentText);
    //     if(commentPoster && commentText){
    //         $.ajax({
    //             url: $(this).attr("data-url"),
    //             method: "POST",
    //             dataType: "json",
    //         }).done(function( dataBack ){
    //             console.log(dataBack);
    //         });
    //     }
    // });
});