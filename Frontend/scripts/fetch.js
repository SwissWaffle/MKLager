const url = "postgresql://MK_User:npg_rlN1fjtm9nHS@ep-broad-hat-a2mbfm2b-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"


async function handleLogin() {
    output = getByElementId("data_output");
    email = getByElementId("email").value;
    password = getByElementId("password").value;
    try {
        const sql = neon(url);
        const user = await sql`
            SELECT email
            FROM Users
            WHERE email = ${email} AND password = ${password}
            LIMIT 1
        `;
        output = `Login successful for user: ${user[0].email}`;
        return;
    } catch (error) {
        console.error("Error occurred while logging in:", error);
        throw error;
    }
}