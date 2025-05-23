const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("database.sqlite");

// Création de la table
db.run(`
  CREATE TABLE IF NOT EXISTS eleves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    identifiant TEXT,
    nom TEXT,
    prenom TEXT,
    date_naissance TEXT,
    sexe TEXT,
    classe TEXT
  )
`);

function genererIdentifiant(callback) {
  db.get(`SELECT COUNT(*) as total FROM eleves`, [], (err, row) => {
    if (err) {
      callback("0001"); // valeur par défaut
    } else {
      const numero = row.total + 1;
      const identifiant = numero.toString().padStart(4, "0");
      callback(identifiant);
    }
  });
}

app.post("/api/eleves", (req, res) => {
  const { nom, prenom, date_naissance, sexe, classe } = req.body;

  genererIdentifiant((identifiant) => {
    db.run(
      `INSERT INTO eleves (identifiant, nom, prenom, date_naissance, sexe, classe) VALUES (?, ?, ?, ?, ?, ?)`,
      [identifiant, nom, prenom, date_naissance, sexe, classe],
      function (err) {
        if (err) {
          console.error(err.message);
          res.status(500).json({ error: "Erreur lors de l'ajout de l'élève" });
        } else {
          res.json({ id: this.lastID, identifiant, nom, prenom, date_naissance, sexe, classe });
        }
      }
    );
  });
});

app.get("/api/eleves", (req, res) => {
  db.all("SELECT * FROM eleves", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Erreur lors de la récupération des élèves" });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
});