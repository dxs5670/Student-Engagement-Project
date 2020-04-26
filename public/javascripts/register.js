


//test to check users rest API is available
$.ajax({
    type:"get",
    url: "http://127.0.0.1:3000/users",
    success: function(data){
        console.log("Successful call to get users"); // add error
    }
});

// create new user
$(document).ready(function () {

    //when button id submit is clicked, 
    $("#register").click(function (e) {

        //get data from form
        var formEmail = $("#email").val();
        var formPassword = $("#pass").val();

        // following line may not be needed, depending on implementation
        e.preventDefault();
                
        //create new data entry
        let data = {};
        data.email = formEmail;
        data.password = formPassword;
        console.log("Your account with the email " + JSON.stringify(data) + " has been created");


        // ajax POST

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://127.0.0.1:3000/users',
            success: function () {
                //serveAccountPage();
                console.log("post success!");
            },
            error: function (data) {
                alert("error: " + data.error)
            }
        });
    });
});

