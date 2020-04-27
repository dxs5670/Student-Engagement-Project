// Deleting an account; confirms PW
$(document).ready(function () {
  $(".delete-account").on("click", function (e) {
    var email = $(".modal-body input[name=email]").val();
    var pass = $(".modal-body input[name=pass]").val();
    var confirm = $(".modal-body input[name=confirm-pass]").val();
    console.log(pass + " " + confirm);

    if (pass != confirm) {
      alert("Error: Passwords do not match");
    } else {
      let data = {};
      data.email = email;
      data.password = pass;
      $.ajax({
        type: "DELETE",
        url: "/users",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
          alert("Deleting Account");
          window.location.href = "/";
        },
        error: function (err) {
          console.log(err);
        },
      });
    }
  });
});

// Updating account
$(document).ready(function () {
  $(".update-account").on("click", function (e) {
    var name = $(".modal-body input[name=name]").val();
    var email = $(".modal-body input[name=email]").val();
    var pass = $(".modal-body input[name=pass]").val();
    var confirm = $(".modal-body input[name=confirm-pass]").val();
    console.log(pass + " " + confirm);

    if (pass != confirm) {
      alert("Error: Passwords do not match");
    } else {
      let data = {};
      data.name = name;
      data.email = email;
      data.password = pass;
      console.log(JSON.stringify(data));
      $.ajax({
        type: "PUT",
        url: "/users",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
          alert("Updated Account");
          window.location.href = "/signIn";
        },
        error: function (err) {
          console.log(err);
        },
      });
    }
  });
});
