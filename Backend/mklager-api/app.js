const express = require("express");
const cors = require("cors");
const app = express();

const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

app.use(cors());

app.get("/data", async (req, res) => {
  const result = await sql.query(`SELECT * FROM "Hauttyp" ORDER BY "PKey_Hauttyp" ASC`);
  //const specific = JSON.parse(result);
  const data = result.map(row => ({
    PKey_Hauttyp: row.PKey_Hauttyp,
    Hauttyp: row.Hauttyp,
  }));
  res.send(data);
});

app.get("/data/month", async (req, res) => {
/* FIGURE OUT FORMATING FOR RESPONSE AND HOW THE QUERY RESULT IS FORMATED */
  const { username, date } = req.query;
  console.log("username:", username);
  console.log("date:", date);
  const result = await sql.query(`SELECT * FROM "v_full_lager" WHERE "verkauf_datum" = $1 AND "consultant" = $2`, [date, username]);
  
  const data = result.map(row => ({
    PKey_Lager: row.PKey_Lager,
    consultant: row.consultant,
    name: row.name,
    artikelnummer: row.art_nr,
    pflegeserie: row.pflege_serie,
    kategorie: row.kategorie,
    hauttyp: row.hauttyp,
    farbe: row.farbe,
    verkauf_datum: row.verkauf_datum,
    menge: row.menge,
  }));
  console.log("data:", data);
  res.send(data);
});


app.get("/test", (req, res) => {
  const result = req.query.test;
  res.json({test: result});
});

app.get("/user/login", async (req, res) => {
  const { connumber, password: entry_password} = req.query;
  try {
    const result = await sql.query(`SELECT "password" FROM "User" WHERE "consultant" = $1`, [connumber]);
  
    const user = result.rows ? result.rows[0] : result[0];
    if (!user) {
      res.status(401).json({auth: false});
        return;
      }
      const true_password = user.password;
      if (entry_password === true_password) {
        res.json({auth: true});
      } else {
        res.status(401).json({auth: false});
      }
    } catch (error) {
      console.error("Error occurred while logging in:", error);
      res.status(500).json({error: "Internal server error"});
    }
});

module.exports = app;