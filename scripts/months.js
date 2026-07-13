const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const d = new Date();
let currentmonthmonth = months[d.getMonth()];
let nextmonthmonth = months[d.getMonth()+1];
let next2monthmonth = months[d.getMonth()+2];
document.getElementById("currentmonth").innerHTML = currentmonthmonth;
document.getElementById("nextmonth").innerHTML = nextmonthmonth;
document.getElementById("next2month").innerHTML = next2monthmonth;