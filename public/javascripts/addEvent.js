


$(document).ready(function () {

    // when login button is clicked,
    $("#submit-event-button").click(function (e) {

        //get data from form
        var formTitle = $("#title").val();
        var formDate = $("#date").val();
        var formHost = $("#host").val();
        var location = $("#place").val();
        var formDesc = $("#subject").val();
        

        e.preventDefault();
        //place credentials in data object 
        let data = {};
        data.title = formTitle;
        data.organization = formHost;
        data.description = formDesc;
        data.eventDate = formDate;
        data.postDate = new Date();
        data.location = location;
        

        console.log(data);
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://127.0.0.1:3000/authenticate',
            success: function () {
                window.location.href = "http://127.0.0.1:3000/events";
                console.log("post success!");
            },
            error: function (data) {
                alert("error: " + data.error)
            }
        });
    });

}) 