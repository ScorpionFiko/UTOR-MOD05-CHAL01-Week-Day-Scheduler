// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // creates the calendar event entries
  createCalendar();
  // sets up the calendar
  setupCalendar();

  // click listener for the previous and next day buttons
  // uses the dayjs to manipulate dates.
  $("button[class*='dayBtn']").on("click", function (event) {
    event.preventDefault();
    calendarDate = dayjs(dayjs(calendarDate).add(parseInt($(this).attr('value')), "day")).format("YYYY-MM-DD");
    setupCalendar();
  });
  // click listeners for the save button
  // checks if event is already entered in the time slot and updates it with new value
  // otherwise creates new event
  // saves as object array in local storage for each particular date
  $("button[class*='saveBtn']").on("click", function (event) {
    event.preventDefault();
    if ($(this).parent().children('textarea').val().trim() !== "") {
      let eventExists = (calendarDateEvents.findIndex(calendarDateEvent => calendarDateEvent.hour === $(this).parent().attr("id")) === 0);
      let existingEventIndex = calendarDateEvents.findIndex(calendarDateEvent => calendarDateEvent.hour === $(this).parent().attr("id"));
      if (eventExists) {
        calendarDateEvents[existingEventIndex] = {
          hour: $(this).parent().attr("id"),
          task: $(this).parent().children('textarea').val().trim()
        };
      } else {
        calendarDateEvents.push({
          hour: $(this).parent().attr("id"),
          task: $(this).parent().children('textarea').val().trim()
        }
        );
      }
      localStorage.setItem(calendarDate, JSON.stringify(calendarDateEvents));
    } else {
      alert("Please enter a task for the time slot");
    }
  });
});


// working variables
let calendarDate = dayjs().format('YYYY-MM-DD');
let calendarDateEvents = [];
let startTime = 8; // 8am 
let endTime = 20; // 8pm
// function that dynamically creates the "div" elements between the startTime and endTime (inclusive) and 
// assigns the ID attribute to hour-X. The 24 hour clock is used to ensure unique ID's. The actual hour that is displayed is obrained from the dayjs.format function (requiring the passing of a date)
function createCalendar() {
  for (startTime; startTime <= endTime; startTime++) {

    $("#calendarDateEvents").append('<div id="hour-" class="row time-block"> <div class="col-2 col-md-1 hour text-center py-3">' + dayjs(calendarDate + " " + startTime + ":00:00").format('hA') + '</div> <textarea class="col-8 col-md-10 description" rows="3"> </textarea> <button class="btn saveBtn col-2 col-md-1" aria-label="save"> <i class="fas fa-save" aria-hidden="true"></i> </button></div>');

    $("#hour-").attr("id", "hour-" + startTime);
  }
}
// setup function that calls all other functions for clearing data, getting store info, populating info, and displaying calendar date on top of the page
function setupCalendar() {
  clearCalendarDateEvents();
  getCalendarDateEvents();
  populateCalendarDateEvents();
  displayCalendarDate();
}
// clears the calendar timeslots and assigns the background colour based on day and time of day
// the selection is on all elements with hour-X id attribute
function clearCalendarDateEvents() {
  $("div[id^='hour-']").each(function () {
    $(this).children('textarea').val("");
    let timeSlot = $(this).attr("id").replace("hour-", "");
    if (dayjs(calendarDate).isBefore(dayjs(), 'day') ||
      (dayjs(calendarDate).isSame(dayjs(), 'day') && timeSlot < parseInt(dayjs().format("H")))) {
      $(this).addClass('past').removeClass('present future');
    } else if (dayjs(calendarDate).isAfter(dayjs(), 'day') ||
      (dayjs(calendarDate).isSame(dayjs(), 'day') && timeSlot > parseInt(dayjs().format("H")))) {
      $(this).addClass('future').removeClass('present past');
    } else {
      $(this).addClass('present').removeClass('future past');
    }
  });
}
// retrieving any stored calendar tasks for a particular date
function getCalendarDateEvents() {
  calendarDateEvents = [];
  if (localStorage.getItem(calendarDate) !== null) {
    calendarDateEvents = JSON.parse(localStorage.getItem(calendarDate));
  }
}
// populates the event calendar
function populateCalendarDateEvents() {
  calendarDateEvents.forEach(calendarDateEvent => {
    $("#" + calendarDateEvent.hour).children('textarea').val(calendarDateEvent.task);
  });
}
// displays the calendar date on top of the page
function displayCalendarDate() {
  $("#calendarDay").text("");
  $("#calendarDay").append(dayjs(calendarDate).format("MMM DD, YYYY"));
}


