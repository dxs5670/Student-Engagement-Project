
$(document).ready(function() {
    appendToEvents();
})


function appendToEvents() {

    $.ajax({
        url: "http://127.0.0.1:3000/events",
        success: function (data) {

            for ( var i = 0; i < data.length; i++) {
                var title = data[i].title;
                var host = data[i].organization;
                var description = data[i].description;
                var date = data[i].eventDate;
                var $page = $("#page"),
                    str = "<div class='card'> <h5 class='card-header'>" + title + "</h5> <div class='card-body'> <h5 class='card-title'>" + host + "</h5> <p class='card-text'>" + description + "</p> <a href='#' class='btn btn-primary'>" + date + "</a> </div> </div>",
                    html = $.parseHTML( str );
                $page.append( html );
            }
        }, error: function (data) {
            alert("error" + data.error)
        }
    });
}
