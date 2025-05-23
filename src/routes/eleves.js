const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Génération identifiant automatique
  function generateIdentifiant(callback) {
    db.get(`SELECT COUNT(*) AS count FROM eleves`, (err, row) => {
      if (err) return callback(err);
      const identifiant = String(row.count + 1).padStart(4, '0');
      callback(null, identifiant);
    });
  }

  router.get('/', (req, res) => {
    db.all('SELECT * FROM eleves', (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.post('/', (req, res) => {
    const { nom, prenom, sexe, date_naissance, classe, montant_inscription, montant_mensuel } = req.body;
    generateIdentifiant((err, identifiant) => {
      if (err) return res.status(500).json({ error: err.message });

      db.run(`
        INSERT INTO eleves (identifiant, nom, prenom, sexe, date_naissance, classe, montant_inscription, montant_mensuel)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [identifiant, nom, prenom, sexe, date_naissance, classe, montant_inscription, montant_mensuel], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, identifiant });
      });
    });
  });

  return router;
};
