const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  router.get('/', (req, res) => {
    db.serialize(() => {
      db.all(`SELECT classe, COUNT(*) as effectif FROM eleves GROUP BY classe`, (err, effectif) => {
        if (err) return res.status(500).json({ error: err.message });

        db.get(`SELECT SUM(montant_inscription) as total_inscription FROM eleves`, (err, insc) => {
          if (err) return res.status(500).json({ error: err.message });

          db.get(`SELECT SUM(montant) as total_paiements FROM paiements`, (err, paiements) => {
            if (err) return res.status(500).json({ error: err.message });

            res.json({
              effectif,
              total_inscription: insc.total_inscription || 0,
              total_paiements: paiements.total_paiements || 0,
              total_global: (insc.total_inscription || 0) + (paiements.total_paiements || 0)
            });
          });
        });
      });
    });
  });

  return router;
};
