const url = "https://mklager-api.nic-weber.workers.dev"

async function getData(path){
    try {
        const response = await fetch(url + path, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function displayData(path) {
    const output = document.getElementById('data_output');

    try {
        output.textContent = JSON.stringify(await getData(path), null, 2);
    } catch (error) {
        output.textContent = `Fehler beim Laden der Daten: ${error.message}`;
    }
}
