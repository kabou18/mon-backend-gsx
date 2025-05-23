import express from 'express';
import {
  getStatistiques,
  getTotalPaiements,
  getPaiementsParClasse,
  getElevesParClasse,
  getPaiementsParMois,
  getStatistiquesParClasse
} from '../controllers/statistiquesController.js';

const router = express.Router();

router.get('/', getStatistiques); 
router.get('/total', getTotalPaiements);
router.get('/par-classe/:classe', getStatistiquesParClasse);
router.get('/eleves-par-classe', getElevesParClasse);
router.get('/paiements-par-classe', getPaiementsParClasse);
router.get('/paiements-par-mois', getPaiementsParMois);

export default router;
