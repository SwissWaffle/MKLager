const express = require("express");
const cors = require("cors");
const app = express();

const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

app.use(cors());

app.get("/data", async (req, res) => {
  const result = await sql.query(`SELECT * FROM "Hauttyp" ORDER BY "PKey_Hauttyp" ASC`);
  const data = result.map(row => ({
    PKey_Hauttyp: row.PKey_Hauttyp,
    Hauttyp: row.Hauttyp,
  }));
  res.send(data);
});

app.get("/data/month", async (req, res) => {
  const { username, date } = req.query;
  console.log("username:", username);
  console.log("date:", date);
  try {
  const result = await sql.query(`SELECT * FROM "v_full_lager" WHERE "verkauf_datum" = $1 AND "consultant_id" = $2`, [date, username]);
  console.log("result:", result);
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
  } catch (error) {
    console.error("Error occurred while getting data for month:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

app.get("/data/specific", async (req, res) => {
  const { username, name, artikelnr, pflegeserie, kategorie, farbe, hauttyp, date } = req.query;
  console.log("username:", username);
  console.log("name:", name);
  console.log("artikelnr:", artikelnr);
  console.log("pflegeserie:", pflegeserie);
  console.log("kategorie:", kategorie);
  console.log("farbe:", farbe);
  console.log("hauttyp:", hauttyp);
  console.log("date:", date);
  try {//FIGURE OUT HOW TO GET SPECIFIC DATA FROM DATABASE
    const result = await sql.query(`SELECT * FROM "v_full_lager" WHERE "consultant_id" = $1 AND "name" = $2 AND "art_nr" = $3 AND "verkauf_datum" = $4  AND "pflege_serie" = $5 AND "kategorie" = $6 AND "hauttyp" = $7 AND "farbe" = $8 `, [username, name, artikelnr, date, pflegeserie, kategorie, hauttyp, farbe]);
    console.log("result:", result);
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
  } catch (error) {
    console.error("Error occurred while getting specific data:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

app.get("/test", (req, res) => {
  const result = req.query.test;
  res.json({test: result});
});

app.get("/user/login", async (req, res) => {
  const { username, password: entry_password} = req.query;
  try {
    const result = await sql.query(`SELECT "password" FROM "User" WHERE "consultant_id" = $1`, [username]);
  
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