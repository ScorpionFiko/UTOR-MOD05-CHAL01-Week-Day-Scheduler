let currentDate = dayjs().format('YYYY-MM-DD');
let workDayEvents = [];
let startTime = 8; // 8am 
let endTime = 20; // 8pm

createDayEvents();
function createDayEvents() {
  for (startTime; startTime <= endTime; startTime++) {

    $("#workday").append('<div id="hour-" class="row time-block"> <div class="col-2 col-md-1 hour text-center py-3">' + dayjs(currentDate + " " + startTime + ":00:00").format('hA') + '</div> <textarea class="col-8 col-md-10 description" rows="3"> </textarea> <button class="btn saveBtn col-2 col-md-1" aria-label="save"> <i class="fas fa-save" aria-hidden="true"></i> </button></div>');
    
    $("#hour-").attr("id", "hour-" + startTime);
  }
}

// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  


  $("button[class*='dayBtn']").on("click", function (event) {
    currentDate = dayjs(dayjs(currentDate).add($(this).attr('value'), "day")).format("YYYY-MM-DD");
    setupCalendar();
  });

  $("button[class*='saveBtn']").on("click",  function (event) {
    if ($(this).parent().children('textarea').val().trim() !== "") {
      let eventExists = (workDayEvents.findIndex(workDayEvent => workDayEvent.hour === $(this).parent().attr("id")) === 0);
      let existingEventIndex = workDayEvents.findIndex(workDayEvent => workDayEvent.hour === $(this).parent().attr("id"));
      if (eventExists) {
        workDayEvents[existingEventIndex] = {
          hour: $(this).parent().attr("id"),
          task: $(this).parent().children('textarea').val().trim()
        };
      } else {
        workDayEvents.push(
          {
            hour: $(this).parent().attr("id"),
            task: $(this).parent().children('textarea').val().trim()
          }
        );
      }
      localStorage.setItem(currentDate, JSON.stringify(workDayEvents));
    } else {
      alert("Please enter a task for the time slot");
    }
  });
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  $("div[id^='hour-']").each(function () {
    let timeSlot = $(this).attr("id").replace("hour-", "");
    if (timeSlot < parseInt(dayjs().format("H"))) {
      $(this).addClass('past').removeClass('present future');
    } else if (timeSlot == parseInt(dayjs().format("H"))) {
      $(this).addClass('present').removeClass('past future');
    } else {
      $(this).addClass('future').removeClass('present past');
    }
  });
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
 
setupCalendar();
  function setupCalendar() {
    clearCurrentDayEvents();
    getCurrentDayEvents();
    populateCurrentDayEvents();
    displayCurrentDay();
  
  }

  // function to automatically create the time slots for a day

  // retrieving any stored user score data
  function getCurrentDayEvents() {
    if (localStorage.getItem(currentDate) !== null) {
      workDayEvents = JSON.parse(localStorage.getItem(currentDate));
    } else {
      workDayEvents =[];
    }
  }

  function clearCurrentDayEvents() {
    $("div[id^='hour-']").each(function () {
      $(this).children('textarea').text("");
    });
  }


  function populateCurrentDayEvents() {
    workDayEvents.forEach(workDayEvent => {
      $("#" + workDayEvent.hour).children('textarea').text(workDayEvent.task);
    });
  }
  // TODO: Add code to display the current date in the header of the page.
  function displayCurrentDay() {
    $("#currentDay").text("");
    $("#currentDay").append(dayjs(currentDate).format("MMM DD, YYYY"));
  }
});
