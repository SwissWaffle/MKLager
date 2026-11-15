const express = require("express");
const cors = require("cors");
const app = express();

const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

app.use(cors());

app.get("/data/hauttyp", async (req, res) => {
  const result = await sql.query(`SELECT * FROM "Hauttyp" ORDER BY "PKey_Hauttyp" ASC`);
  const data = result.map(row => ({
    PKey_Hauttyp: row.PKey_Hauttyp,
    hauttyp: row.Hauttyp,
  }));
  res.send(data);
});

app.get("/data/pflege_serie", async (req, res) => {
  const result = await sql.query(`SELECT * FROM "Pflege_Serie" ORDER BY "PKey_Pflege_Serie" ASC`);
  const data = result.map(row => ({
    PKey_Pflege_Serie: row.PKey_Pflege_Serie,
    pflege_Serie: row.Pflege_Serie,
  }));
  res.send(data);
});

app.get("/data/kategorie", async (req, res) => {
  const result = await sql.query(`SELECT * FROM "Kategorie" ORDER BY "PKey_Kategorie" ASC`);
  const data = result.map(row => ({
    PKey_Kategorie: row.PKey_Kategorie,
    kategorie: row.Kategorie,
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

app.get("/data/month/pastdate", async (req, res) => {
  const { username, date } = req.query;
  console.log("username:", username);
  try {
  const result = await sql.query(`SELECT * FROM "v_full_lager" WHERE to_date("verkauf_datum", 'MM/YY') < to_date($1, 'MM/YY') AND "consultant_id" = $2`, [date, username]);
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
  
  // made with AI--------------
  try {
    const filters = [
      ["name", name],
      ["art_nr", artikelnr],
      ["verkauf_datum", date],
      ["pflege_serie", pflegeserie],
      ["kategorie", kategorie],
      ["hauttyp", hauttyp],
      ["farbe", farbe],
    ];
    const values = [username];
    const conditions = [`"consultant_id" = $1`];
    
    for (const [column, value] of filters) {
      if (value !== undefined && value !== null && value !== "" && value !== "none") {
        values.push(value);
        conditions.push(`"${column}" = $${values.length}`);
      }
    }

    const result = await sql.query(
      `SELECT * FROM "v_full_lager" WHERE ${conditions.join(" AND ")}`,
      values
    );
  //--------------------------------
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
    console.log("")
    console.error("Error occurred while getting specific data:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

app.get("/data/create", async (req, res) => {
  const { username, artikelnr, date, menge } = req.query;
  console.log("username:", username);
  console.log("artikelnr:", artikelnr);
  console.log("date:", date);
  console.log("menge:", menge);
  if (date === "/") {
    res.status(400).json({error: "Invalid date format"});
    return;}
  try {
    const result = await sql.query(`INSERT INTO "Lager" ("FKey_User", "FKey_Produkte", "verkauf_datum", "menge") VALUES ((SELECT "PKey_User" FROM "User" WHERE "consultant_id" = $1), (SELECT "PKey_Produkte" FROM "Produkte" WHERE "art_nr" = $2), $3, $4)`, [username, artikelnr, date, menge]);
    res.json({success: true});
  } catch (error) {
    console.error("Error occurred while creating data:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

app.get("/data/change", async (req, res) => {
  const { verkauf_datum, menge, pkey } = req.query;
  console.log("verkauf_datum:", verkauf_datum);
  console.log("menge:", menge);
  console.log("pkey:", pkey);
  try {
    const result = await sql.query(`UPDATE "Lager" SET "verkauf_datum" = $1, "menge" = $2 WHERE "PKey_Lager" = $3`, [verkauf_datum, menge, pkey]);
    res.json({success: true});
  } catch (error) {
    console.error("Error occurred while changing data:", error);
    res.status(500).json({error: "Internal server error"});
  }
});

app.get("/data/delete", async (req, res) => {
  const { pkey } = req.query;
  console.log("pkey:", pkey);
  try {
    const result = await sql.query(`DELETE FROM "Lager" WHERE "PKey_Lager" = $1`, [pkey]);
    res.json({success: true});
  } catch (error) {
    console.error("Error occurred while deleting data:", error);
    res.status(500).json({error: "Internal server error"});
  }
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