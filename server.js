import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import paiementsRoutes from './routes/paiementsRoutes.js';
import elevesRoutes from './routes/elevesRoutes.js';
import classesRoutes from './routes/classesRoutes.js';
import statistiquesRoutes from './routes/statistiquesRoutes.js';
// Ajoute ici les autres routes si tu as authRoutes par exemple
// import authRoutes from './routes/authRoutes.js';

import Classe from './models/Classe.js'; // Si encore utilisé pour /api/classes

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gestion_scolaire', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/eleves', elevesRoutes);
app.use('/api/paiements', paiementsRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/statistiques', statistiquesRoutes);
// app.use('/api/auth', authRoutes); // Si tu actives l'authentification

// Optionnel : ancienne route directe pour récupérer les classes
app.get('/api/classes', async (req, res) => {
  try {
    const classes = await Classe.find();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des classes.' });
  }
});

// Démarrage du serveur
app.listen(5000, () => {
  console.log('Serveur démarré sur le port 5000');
});
