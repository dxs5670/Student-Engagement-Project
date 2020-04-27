import $, { ajax } from "jquery";

//JQuery REST calls

// test to check that events rest API is available
ajax({
  type: "get",
  url: "http://127.0.0.1:3000/events",
  success: function (data) {
    console.log("Successful call to get events"); // add error
  },
});

// load event data when document is loaded
$(document).ready(function () {
  loadEventList();
});

// get event data and add to the page
// (i.e. ajax PULL)
function loadEventList() {
  $ajax({
    url: "http://127.0.0.1:3000/events",
    success: function (data) {
      // clear event list
      var eventList = document.getElementById("eventList");
      if (eventList) {
        while (eventList.firstChild) {
          loadEventList.removeChild(eventList.firstChild);
        }
      }

      // Reload event list
      for (var i = 0; i < data.length; i++) {
        var eventTitle = data[i].title;
        var eventDescription = data[i].description;
        var eventDate = data[i].eventDate;
        var li = document.createElement("li");
        li.appendChild(
          document.createTextNode(
            eventTitle + " on " + eventDate + " - " + eventDescription
          )
        );
        eventList.appendChild(li);
      }
    },
    //catch error
    error: function (data) {
      alert("error" + data.error);
    },
  });
}

// post new event
$(document).ready(function () {
  //when button id submit is clicked,
  $("#submit").click(function (e) {
    //get data from form
    var formTitle = $("#title").val();
    var formOrganization = $("#organization").val();
    var formDescription = $("#description").val();
    var formEventDate = $("#eventDate").val();
    var formPostDate = $("#postDate").val();

    // following line may not be needed, depending on implementation
    //e.preventDefault();

    //create new data entry
    var data = {};
    data.title = formTitle;
    data.organization = formOrganization;
    data.description = formDescription;
    data.eventDate = formEventDate;
    data.postDate = formPostDate;
    console.log(
      "Your event, " + data.title + ", has been posted for " + data.eventDate
    );

    // ajax POST

    ajax({
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      url: "http://127.0.0.1:3000/events",
      success: function (data) {
        loadCourseList();
        document.getElementById("eventForm").reset();
      },
      error: function (data) {
        alert("error: " + data.error);
      },
    });
  });
});
