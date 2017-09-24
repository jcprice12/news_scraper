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
            if(dataBack.hasOwnProperty("error")){
                alert(dataBack.error);
            } else {
                if(dataBack.hasOwnProperty("success")){
                    $("#comment_" + dataBack.success).remove();
                }
            }
        });
    });

    // $(".like").click(function(){
    //     var id=$(this).attr("data-like-comment");
    //     $.ajax({
    //         url: "/comment/" + id,
    //         method: "PUT",
    //         dataType: "json",
    //     }).done(function( dataBack ) {
    //         if(dataBack.hasOwnProperty("error")){
    //             alert(dataBack.error);
    //         } else {
    //             console.log(dataBack);
    //             $("#likes_"+dataBack._id).html("Likes: " + dataBack.likes);
    //         }
    //     });
    // });

});