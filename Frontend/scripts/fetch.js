const url = "https://mklager-api.nic-weber.workers.dev";

function getStoredToken() {
    return localStorage.getItem('neon_access_token');
}

function persistToken(token) {
    if (!token) {
        return;
    }

    localStorage.setItem('neon_access_token', token);
}

function getAuthHeaders(extraHeaders = {}) {
    const token = getStoredToken();

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extraHeaders,
    };
}

async function getData(path) {
    const token = getStoredToken();

    if (!token) {
        throw new Error('Bitte melden Sie sich an, um Daten abzurufen.');
    }

    try {
        const response = await fetch(url + path, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(payload.error || `Request failed with status ${response.status}`);
        }

        return payload;
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
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(payload.error || `Request failed with status ${response.status}`);
        }

        const token = payload.access_token || payload.token || payload.accessToken;
        if (token) {
            persistToken(token);
        }

        return payload;
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
        const loginResult = await logIn(path, data);
        output.textContent = JSON.stringify(loginResult);
        return loginResult;
    } catch (error) {
        output.textContent = `Fehler beim Login: ${error.message}`;
        return null;
    }
}

async function handleLogin() {
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;
    const output = document.getElementById('data_output');

    if (!email || !password) {
        output.textContent = 'Bitte E-Mail und Passwort eingeben.';
        return;
    }

    const result = await displayLogin('/login', { email, password });
    if (result && (result.access_token || result.token || result.accessToken)) {
        const username = document.getElementById('username');
        if (username) {
            username.textContent = email;
        }
        disHome();
    }
}

function handleLogout() {
    localStorage.removeItem('neon_access_token');
    const username = document.getElementById('username');
    if (username) {
        username.textContent = 'Username';
    }
    disLogin();
}

async function signUp(data) {
  try {
    const response = await fetch(`${url}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || `Sign up failed with status ${response.status}`);
    }

    return payload;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}