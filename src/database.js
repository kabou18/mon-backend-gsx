const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'ecole.db'), (err) => {
  if (err) {
    console.error('Erreur de connexion à SQLite', err);
  } else {
    console.log('Connecté à SQLite');
  }
});

// Création des tables si elles n'existent pas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS eleves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      identifiant TEXT UNIQUE,
      nom TEXT,
      prenom TEXT,
      sexe TEXT,
      date_naissance TEXT,
      classe TEXT,
      montant_inscription REAL,
      montant_mensuel REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS paiements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      eleve_id INTEGER,
      mois TEXT,
      montant REAL,
      date TEXT DEFAULT CURRENT_DATE,
      FOREIGN KEY (eleve_id) REFERENCES eleves(id)
    )
  `);
});

module.exports = db;
