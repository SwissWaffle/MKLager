var login = document.getElementById("login");
var home = document.getElementById("home");
var filter = document.getElementById("filter");
var eintrag_display = document.getElementById("eintrag_display");
var eintrag_create = document.getElementById("eintrag_create");
var eintrag_change = document.getElementById("eintrag_change");




function disHome(){
    login.style.display = "none";
    home.style.display = "block";
    filter.style.display = "none";
    eintrag_display.style.display = "none";
    eintrag_create.style.display = "none";
    eintrag_change.style.display = "none";
};

function disLogin(){
    login.style.display = "block";
    home.style.display = "none";
    filter.style.display = "none";
    eintrag_display.style.display = "none";
    eintrag_create.style.display = "none";
    eintrag_change.style.display = "none";
};

function disFilter(){
    login.style.display = "none";
    home.style.display = "none";
    filter.style.display = "block";
    eintrag_display.style.display = "none";
    eintrag_create.style.display = "none";
    eintrag_change.style.display = "none";
};

function disEintragDisplay(){
    login.style.display = "none";
    home.style.display = "none";
    filter.style.display = "none";
    eintrag_display.style.display = "block";
    eintrag_create.style.display = "none";
    eintrag_change.style.display = "none";
};

function disEintragCreate(){
    login.style.display = "none";
    home.style.display = "none";
    filter.style.display = "none";
    eintrag_display.style.display = "none";
    eintrag_create.style.display = "block";
    eintrag_change.style.display = "none";
};

function disEintragChange(){
    login.style.display = "none";
    home.style.display = "none";
    filter.style.display = "none";
    eintrag_display.style.display = "none";
    eintrag_create.style.display = "none";
    eintrag_change.style.display = "block";
};