const api_url = "https://mklager-api.nic-weber.workers.dev";

async function returnHome() {
    const display = document.getElementById("eintrag_lineup");
    while (display.firstChild) {
        display.removeChild(display.firstChild);
    }
    disHome();
}

async function dataMonth(month) {
    const username = document.getElementById("username").textContent;
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + month, 1);
    const u_month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const u_year = String(targetDate.getFullYear()).slice(-2);

    const verkauf_datum = u_month + "/" + u_year;
    console.log("verkauf_datum:", verkauf_datum);
     try {
        const response = await fetch(`${api_url}/data/month?username=${username}&date=${verkauf_datum}`, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
        //output.textContent = JSON.stringify(data, null, 2);
        //disEintragDisplay();
        length = data.length;
        console.log("length:", length);
        const template = document.getElementById("eintrag_single_template");
        //let clone = t_eintrag_single.cloneNode(true);
        //let clone = t_eintrag_single.cloneNode(true);
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
            /*pkey = clone.getElementById("pkey").textContent;
            /*text_extra = clone.getElementById("text_extra").textContent = data[i].hauttype + data[i].farbe;
            text_date = clone.getElementById("text_date").textContent = data[i].verkauf_datum;
            text_menge = clone.getElementById("text_menge").textContent = data[i].menge;
            text_name = clone.getElementById("text_name").textContent = data[i].name;
            info = clone.getElementById("info").textContent = data[i];
            pkey = data[i].pkey;
            clone.setAttribute("id", "eintrag_single_template");
            clone.setAttribute("data-pkey", pkey);*/



            
            document.getElementById("eintrag_lineup").appendChild(clone);
            }
        disEintragDisplay();
        return;
    } catch (error) {
        console.error("Error occurred while getting data:", error);
        throw error;
    }
}
window.returnHome = returnHome;
window.dataMonth = dataMonth;
/*
   try {
        const response = await fetch(`${api_url}/data/month?username=${username}&date=${verkauf_datum}`, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
        if(!data.auth) {
            output.textContent = "*Email oder Passwort ist falsch*";
            console.error("Login failed for user:", email);
            return;
        }
        document.getElementById("username").textContent = email;
        disHome();
        return;


    } catch (error) {
        output.textContent = "Error occurred while logging in.";
        console.error("Error occurred while logging in:", error);
        throw error;
    }*/