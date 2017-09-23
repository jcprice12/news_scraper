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
            removeArticle(id);
        });
    });
});