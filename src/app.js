// backend/src/app.js
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
const elevesRoutes = require('./routes/eleves')(db);
const paiementsRoutes = require('./routes/paiements')(db);
const statistiquesRoutes = require('./routes/statistiques')(db);

app.use('/api/eleves', elevesRoutes);
app.use('/api/paiements', paiementsRoutes);
app.use('/api/statistiques', statistiquesRoutes);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
