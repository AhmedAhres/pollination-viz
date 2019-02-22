// Initializations for SSP1, SSP3, and SSP5 for slider for 3D storytelling
let ssp1 = document.getElementById("ssp1");
let ssp3 = document.getElementById("ssp3");
let ssp5 = document.getElementById("ssp5");
let selector = document.getElementById("selector");
selector.style.left = 0;
selector.style.width = 10.5 + "vh";
selector.style.backgroundColor = "#777777";
selector.innerHTML = "SSP1";

// For 3D storytelling when the slider appears when you are on 2050 in the slider
function change_period(period) {
  if (period === "ssp1") {
    selector.style.left = 0;
    selector.style.width = ssp1.clientWidth + "px";
    selector.style.backgroundColor = "#777777";
    selector.innerHTML = "SSP1";
    current_SSP = "SSP1";
  } else if (period === "ssp3") {
    selector.style.left = ssp1.clientWidth + "px";
    selector.style.width = ssp3.clientWidth + "px";
    selector.innerHTML = "SSP3";
    selector.style.backgroundColor = "#418d92";
    current_SSP = "SSP3";
  } else {
    selector.style.left = ssp1.clientWidth + ssp3.clientWidth + 1 + "px";
    selector.style.width = ssp5.clientWidth + "px";
    selector.innerHTML = "SSP5";
    selector.style.backgroundColor = "#4d7ea9";
    current_SSP = "SSP5";
  }
  // Load the data for SSP1, SSP3, and SSP5
  change_pollination_contribution(current_SSP);
  title.innerHTML = "Pollination Contribution to Nutrition (" + current_viz + ") in 2050 - " + current_SSP;
  update_percentages(current_SSP);
  contribution_text.innerHTML = "What is the percentage of pollination contribution to " +
    current_viz + " in " + current_SSP + "?";
}

// Function to show the different SSP scenarios when the slider is on 2050
function showSSPs() {
  document.getElementsByClassName('switch_3_ways')[0].style.display = "block";
  document.getElementsByClassName('nav-bar-hidden')[0].style.display = "block";
}

// Function to show the hide the different SSP scenarios when the slider is not on 2050
function removeSSPs() {
  document.getElementsByClassName('switch_3_ways')[0].style.display = "none";
  document.getElementsByClassName('nav-bar-hidden')[0].style.display = "none";
}