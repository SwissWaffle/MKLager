const months = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember","Januar","Februar"];

const d = new Date();
let currentmonthmonth = months[d.getMonth()];
let nextmonthmonth = months[d.getMonth()+1];
let next2monthmonth = months[d.getMonth()+2];
document.getElementById("currentmonth").innerHTML = currentmonthmonth;
document.getElementById("nextmonth").innerHTML = nextmonthmonth;
document.getElementById("next2month").innerHTML = next2monthmonth;