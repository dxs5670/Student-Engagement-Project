// set vars to be used on calendar
var today = new Date();
var thisDay = today.getDate();
var thisMonth = today.getMonth();
var thisYear = today.getFullYear();
var thisWeekDay = today.getDay();

// day and month lists for conversion
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// set current month upon open
document.getElementById("currentMonth").innerHTML =
  months[thisMonth] + " " + thisYear;

//Create event listeenrs for forward ad back buttons
document
  .getElementById("calendarLastButton")
  .addEventListener("click", lastMonth);
document
  .getElementById("calendarNextButton")
  .addEventListener("click", nextMonth);

// change year and month to next month
function nextMonth() {
  thisYear = thisMonth === 11 ? thisYear + 1 : thisYear;
  thisMonth = (thisMonth + 1) % 12;
  document.getElementById("currentMonth").innerHTML =
    months[thisMonth] + " " + thisYear;
}

// change year and month to previous month
function lastMonth() {
  thisYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  thisMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  document.getElementById("currentMonth").innerHTML =
    months[thisMonth] + " " + thisYear;
}
