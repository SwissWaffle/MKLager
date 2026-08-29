const url = "https://mklager-api.nic-weber.workers.dev"

async function getData(path){
    try {
        const response = await fetch(url + path, {

            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
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

async function logIn(path, data) {
    try {
        const response = await fetch(url + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
}

async function displayData(path) {
    const output = document.getElementById('data_output');

    try {
        output.textContent = JSON.stringify(await getData(path));
    } catch (error) {
        output.textContent = `Fehler beim Laden der Daten: ${error.message}`;
    }
}



async function displayLogin(path, data) {
    const output = document.getElementById('data_output');

    try {
        output.textContent = JSON.stringify(await logIn(path, data));
    } catch (error) {
        output.textContent = `Fehler beim Login: ${error.message}`;
    }
}
