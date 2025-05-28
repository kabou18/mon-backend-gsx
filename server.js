import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

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

// Debug temporaire : afficher la variable d'environnement
console.log('MONGODB_URI:', process.env.MONGODB_URI);
// Connexion à MongoDB Atlas via la variable d'environnement
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Connecté à MongoDB Atlas'))
.catch((err) => console.error('❌ Erreur de connexion MongoDB :', err));


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

// Lancer le serveur sur le port défini dans .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});