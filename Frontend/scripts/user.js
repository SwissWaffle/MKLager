var api_url = "https://mklager-api.nic-weber.workers.dev";

async function handleLogin() {
    const output = document.getElementById("error_msg");
    const connumber = document.getElementById("connumber").value.toLowerCase();
    const password = document.getElementById("password").value;
    try {
        const response = await fetch(`${api_url}/user/login?username=${connumber}&password=${password}`, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
        if(!data.auth) {
            output.textContent = "*Consultant Nummer oder Passwort ist falsch*";
            console.error("Login failed for user:", connumber);
            return;
        }
        document.getElementById("username").textContent = connumber;
        disHome();
        return;


    } catch (error) {
        output.textContent = "Bei der Anmeldung ist ein Fehler aufgetreten.";
        console.error("Error occurred while logging in:", error);
        throw error;
    }
}


async function handleLogout() {
    try {
    const output = document.getElementById("error_msg");
    const connumber = document.getElementById("connumber");
    const password = document.getElementById("password");
    const username = document.getElementById("username");
    output.textContent = "";
    connumber.value = "";
    password.value = "";
    username.textContent = "";
    disLogin();
    return;
    }catch (error) {
        console.error("Error occurred while logging out:", error);
        throw error;
    }
}

//https://mklager-api.nic-weber.workers.dev/user/login?connumber=tester&password=test