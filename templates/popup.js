// Waypoint initialization - since use of library
let waypoint = new Waypoint({
  element: document.getElementById('3rd_box'),
  handler: function() {
    PopUp('show')
  }
});

// For the popup window - controls the showing and hiding
function PopUp(hideOrshow) {
  if (hideOrshow == 'hide') {
    document.getElementById('ac-wrapper').style.display = "none";
  } else if (localStorage.getItem("popupWasShown") == null) {
    localStorage.setItem("popupWasShown", 1);
    document.getElementById('ac-wrapper').removeAttribute('style');
  }
}

// For hiding the popup window
function hideNow(e) {
  if (e.target.id == 'ac-wrapper') document.getElementById('ac-wrapper').style.display = 'none';
}

// For showing the popup window
function showNow() {
  document.getElementById('ac-wrapper').style.display = "inline";
}