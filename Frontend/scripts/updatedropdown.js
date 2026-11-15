var api_url = "https://mklager-api.nic-weber.workers.dev";

const template = document.getElementById("filter_dropdown_template");

async function updatePflege_Serie() {
    try {
        const response = await fetch(`${api_url}/data/pflege_serie`);
        const data = await response.json();
        console.log("Pflege Serie data:", data);
        const pflegeSerieSelect = document.getElementById("filter_pflege_serie");
        pflegeSerieSelect.innerHTML = '<option value=""></option>';

        data.forEach(item => {
            var clone = template.content.cloneNode(true);
            const option = clone.querySelector("option");
            option.value = item.pflege_serie;
            option.textContent = item.pflege_serie;
            pflegeSerieSelect.appendChild(clone);
        });
    } catch (error) {
        console.error("Error updating Pflege Serie dropdown:", error);
    }
}

//https://mklager-api.nic-weber.workers.dev/data/pflege_serie

async function updateKategorie() {
    try {
        const response = await fetch(`${api_url}/data/kategorie`);
        const data = await response.json();
        const kategorieSelect = document.getElementById("filter_kategorie");
        kategorieSelect.innerHTML = "";
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.kategorie;
            option.textContent = item.kategorie;
            kategorieSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error updating Kategorie dropdown:", error);
    }
}

async function updateHauttyp() {
    try {
        const response = await fetch(`${api_url}/data/hauttyp`);
        const data = await response.json();
        const hauttypSelect = document.getElementById("filter_hauttyp");
        hauttypSelect.innerHTML = "";
        data.forEach(item => {
            const option = document.createElement("option");
            option.value = item.hauttyp;
            option.textContent = item.hauttyp;
            hauttypSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error updating Hauttyp dropdown:", error);
    }
}

updatePflege_Serie();