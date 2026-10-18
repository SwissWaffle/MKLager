var api_url = "https://mklager-api.nic-weber.workers.dev";

async function returnHome() {
    const display = document.getElementById("eintrag_lineup");
    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }
    disHome();
}
async function dataSpecific() {
    var username = document.getElementById("username").textContent;
    var name = document.getElementById("name").value;
    var artikelnr = document.getElementById("artikelnr").value;
    var pflegeserie = document.getElementById("pflege_serie").value;
    var kategorie = document.getElementById("kategorie").value;
    var farbe = document.getElementById("farbe").value;
    var hauttyp = document.getElementById("hauttyp").value;
    var date = document.getElementById("datum").value;
    var year = date.slice(0, 4);
    var month = date.slice(5, 7);
    var verkauf_datum = month + "/" + year.slice(-2);
    console.log("verkauf_datum:", verkauf_datum);
    try {
        const response = await fetch(`${api_url}/data/specific?username=${username}&name=${name}&artikelnr=${artikelnr}&pflegeserie=${pflegeserie}&kategorie=${kategorie}&farbe=${farbe}&hauttyp=${hauttyp}&date=${verkauf_datum}`, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
        dataDisplay(data);
        disEintragDisplay();
        return;
    } catch (error) {
        console.error("Error occurred while getting data:", error);
        throw error;
    }
}



async function dataMonth(month) {
    var username = document.getElementById("username").textContent;
    var now = new Date();
    var targetDate = new Date(now.getFullYear(), now.getMonth() + month, 1);
    var u_month = String(targetDate.getMonth() + 1).padStart(2, "0");
    var u_year = String(targetDate.getFullYear()).slice(-2);

    var verkauf_datum = u_month + "/" + u_year;
    console.log("verkauf_datum:", verkauf_datum);
     try {
        const response = await fetch(`${api_url}/data/month?username=${username}&date=${verkauf_datum}`, {
            headers: {
                "Content-Type": "application/json"
            }
            //https://mklager-api.nic-weber.workers.dev/data/month?username=tester&date=11/26
        })
        const data = await response.json();
        dataDisplay(data);
        /*length = data.length;
        console.log("length:", length);
        const template = document.getElementById("eintrag_single_template");
        for (let i = 0; i < length; i++){
            console.log("data[i]:", data[i]);
            const clone = template.content.cloneNode(true);
            clone.querySelector("#pkey").textContent = data[i].PKey_Lager;
            if (data[i].hauttyp === null) {
                data[i].hauttyp = "";
            }
            if (data[i].farbe === null) {
                data[i].farbe = "";
            }
            clone.querySelector("#text_extra").textContent = data[i].hauttyp + " " + data[i].farbe;
            clone.querySelector("#text_date").textContent = data[i].verkauf_datum;
            clone.querySelector("#text_menge").textContent = data[i].menge;
            clone.querySelector("#text_name").textContent = data[i].name;
            clone.querySelector("#info").textContent = JSON.stringify(data[i]);
            clone.querySelector("#eintrag_single").setAttribute("PKey_Lager", data[i].PKey_Lager);
            document.getElementById("eintrag_lineup").appendChild(clone);
            }*/
        disEintragDisplay();
        return;
    } catch (error) {
        console.error("Error occurred while getting data:", error);
        throw error;
    }
}

async function dataDisplay(data) {
    var length = data.length;
        console.log("length:", length);
        var template = document.getElementById("eintrag_single_template");
        for (let i = 0; i < length; i++){
            console.log("data[i]:", data[i]);
            var clone = template.content.cloneNode(true);
            clone.querySelector("#pkey").textContent = data[i].PKey_Lager;
            if (data[i].hauttyp === null) {
                data[i].hauttyp = "";
            }
            if (data[i].farbe === null) {
                data[i].farbe = "";
            }
            clone.querySelector("#text_extra").textContent = data[i].hauttyp + " " + data[i].farbe;
            clone.querySelector("#text_date").textContent = data[i].verkauf_datum;
            clone.querySelector("#text_menge").textContent = data[i].menge;
            clone.querySelector("#text_name").textContent = data[i].name;
            clone.querySelector("#info").textContent = JSON.stringify(data[i]);
            clone.querySelector("#eintrag_single").setAttribute("PKey_Lager", data[i].PKey_Lager);
            document.getElementById("eintrag_lineup").appendChild(clone);
            }
        return;
}
