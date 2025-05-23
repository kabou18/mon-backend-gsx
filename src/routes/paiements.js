const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    db.all(`
      SELECT paiements.*, eleves.nom, eleves.prenom, eleves.classe
      FROM paiements
      JOIN eleves ON paiements.eleve_id = eleves.id
    `, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  router.post('/', (req, res) => {
    const { eleve_id, mois, montant } = req.body;

    db.run(`
      INSERT INTO paiements (eleve_id, mois, montant)
      VALUES (?, ?, ?)
    `, [eleve_id, mois, montant], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
  });

  return router;
};
