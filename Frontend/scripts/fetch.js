const url = "postgresql://MK_User:npg_rlN1fjtm9nHS@ep-broad-hat-a2mbfm2b-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
 import { neon } from "@neondatabase/serverless";

async function handleLogin() {
    output = document.getElementById("data_output");
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    try {
        const sql = neon(url);
        const user = await sql`
            SELECT email
            FROM Users
            WHERE email = ${email} AND password = ${password}
            LIMIT 1
        `;
        output.textContent = `Login successful for user: ${user[0].email}`;
        return;
    } catch (error) {
        console.error("Error occurred while logging in:", error);
        throw error;
    }
}