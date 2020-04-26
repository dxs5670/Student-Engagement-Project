// login


$(document).ready(function () {

    // when login button is clicked,
    $("#login").click(function (e) {

        //get data from form
        var formEmail = $("#email").val();
        var formPassword = $("#pass").val();

        e.preventDefault();
        //place credentials in data object 
        let data = {};
        data.email = formEmail;
        data.password = formPassword;


        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://127.0.0.1:3000/authenticate',
            success: function () {
                window.location.href = "http://127.0.0.1:3000/account.html";
                console.log("post success!");
            },
            error: function (data) {
                alert("error: " + data.error)
            }
        });
    });

}) 


      
      function redirectToAccount(){
        var settings = {
          "async": true,
          "crossDomain": true,
          "url": "/account",
          "type": "GET",
          "headers": {
            "authorization": "Bearer " + getCookie('token'),
            "cache-control": "no-cache"
          }
        }
      
        $.ajax(settings).done(function (response) {
          $('body').replaceWith(response);
        });
      }
      
      function getCookie(cname) {
          var name = cname + "=";
          var decodedCookie = decodeURIComponent(document.cookie);
          var ca = decodedCookie.split(';');
          for(var i = 0; i <ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0) == ' ') {
                  c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
                  return c.substring(name.length, c.length);
              }
          }
          return "";
      }

     