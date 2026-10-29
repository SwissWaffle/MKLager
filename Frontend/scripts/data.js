var api_url = "https://mklager-api.nic-weber.workers.dev";


async function returnHome() {
    const display = document.getElementById("eintrag_lineup");
    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }
    disHome();
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
        disEintragDisplay();
        return;
    } catch (error) {
        console.error("Error occurred while getting data:", error);
        throw error;
    }
}

//NOT DONE!!!!!!!!!!!!!!!!!!!!!!!!!!
async function dataSpecific() {
    var username = document.getElementById("username").textContent;
    var name = document.getElementById("filter_name").value;
    var artikelnr = document.getElementById("filter_artikelnr").value;
    var pflegeserie = document.getElementById("filter_pflege_serie").value;
    var kategorie = document.getElementById("filter_kategorie").value;
    var farbe = document.getElementById("filter_farbe").value;
    var hauttyp = document.getElementById("filter_hauttyp").value;
    var date = document.getElementById("filter_datum").value;
    var year = date.slice(0, 4);
    var month = date.slice(5, 7);
    var verkauf_datum = month + "/" + year.slice(-2);
    console.log("verkauf_datum:", verkauf_datum);
    //console.log("farbe:", farbe);
    try {
        const response = await fetch(`${api_url}/data/specific?username=${username}${name !== "" && name !== undefined ? `&name=${name}` : `&name=none`}${artikelnr !== "" && artikelnr !== undefined ? `&artikelnr=${artikelnr}` : `&artikelnr=none`}${pflegeserie !== "" && pflegeserie !== undefined ? `&pflegeserie=${pflegeserie}` : `&pflegeserie=none`}${kategorie !== "" && kategorie !== undefined ? `&kategorie=${kategorie}` : `&kategorie=none`}${farbe === "" ? `&farbe=none` : `&farbe=${farbe}`}${hauttyp !== "" && hauttyp !== undefined ? `&hauttyp=${hauttyp}` : `&hauttyp=none`}${date ? `&date=${verkauf_datum}` : `&date=none`}`, {
            headers: {
                "Content-Type": "application/json"
            }
        
        })
        console.log("fetch", `${api_url}/data/specific?username=${username}${name !== "" && name !== undefined ? `&name=${name}` : `&name=none`}${artikelnr !== "" && artikelnr !== undefined ? `&artikelnr=${artikelnr}` : `&artikelnr=none`}${pflegeserie !== "" && pflegeserie !== undefined ? `&pflegeserie=${pflegeserie}` : `&pflegeserie=none`}${kategorie !== "" && kategorie !== undefined ? `&kategorie=${kategorie}` : `&kategorie=none`}${farbe === "" ? `&farbe=none` : `&farbe=${farbe}`}${hauttyp !== "" && hauttyp !== undefined ? `&hauttyp=${hauttyp}` : `&hauttyp=none`}${date ? `&date=${verkauf_datum}` : `&date=none`}`);
        const data = await response.json();
        dataDisplay(data);
        disEintragDisplay();
        return;
    } catch (error) {
        console.error("Error occurred while getting data:", error);
        throw error;
    }
}
//https://mklager-api.nic-weber.workers.dev/data/specific?username=tester&name=null&artikelnr=null&pflegeserie=Repair&kategorie=null&farbe=null&hauttyp=null&date=null

async function dataCreate() {
    var username = document.getElementById("username").textContent;
    var artikelnr = document.getElementById("create_artikelnr").value;
    var date = document.getElementById("create_datum").value;
    var year = date.slice(0, 4);
    var month = date.slice(5, 7);
    var verkauf_datum = month + "/" + year.slice(-2);
    var menge = document.getElementById("create_menge").value;
    var output = document.getElementById("create_error_msg");
    output.textContent = "";
    console.log("username:", username);
    console.log("verkauf_datum:", verkauf_datum);
    console.log("menge:", menge);
    console.log("artikelnr:", artikelnr);
    console.log("username:", username);
    try {
        const response = await fetch(`${api_url}/data/create?username=${username}&artikelnr=${artikelnr}&date=${verkauf_datum}&menge=${menge}`, {
            headers: {
                "Content-Type": "application/json"
            }

        })
        const data = await response.json();
        if (data.success) {
            console.log("Data created successfully");
            disHome();
        }else {
            console.error("Failed to create data:", data.error);
            output.textContent = "*Eingetragene Daten sind ungültig*";
        }
        return;
    }catch (error) {
        console.error("Error occurred while creating data:", error);
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
            clone.querySelector("#text_extra").textContent = data[i].hauttyp + "" + data[i].farbe;
            clone.querySelector("#text_date").textContent = data[i].verkauf_datum;
            clone.querySelector("#text_menge").textContent = data[i].menge+" Stk.";
            clone.querySelector("#text_name").textContent = data[i].name;
            clone.querySelector("#info").textContent = JSON.stringify(data[i]);
            clone.querySelector("#eintrag_single").setAttribute("PKey_Lager", data[i].PKey_Lager);
            document.getElementById("eintrag_lineup").appendChild(clone);
            }
        return;
}
