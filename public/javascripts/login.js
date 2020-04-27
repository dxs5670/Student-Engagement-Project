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

    // ajax POST
    $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "http://127.0.0.1:3000/authenticate",
      success: function () {
        window.location.href = "http://127.0.0.1:3000/account";
        console.log("post success!");
      },
      error: function (data) {
        alert("error: " + data.error);
      },
    });
  });
});
