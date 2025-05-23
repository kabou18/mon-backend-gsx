import express from 'express';
import {
  createPaiement,
  getAllPaiements,
  getPaiementsParMois,
  getPaiementsParClasseEtMois,
  ajouterPaiement,
  getPaiementsParMoisClasseSituation,
  getPaiementsImpayesParClasseEtMois
} from '../controllers/paiementsController.js';

const router = express.Router();

router.post('/', createPaiement);
router.get('/', getAllPaiements);
router.get('/mois/:mois', getPaiementsParMois);
router.get('/classe/:classe/mois/:mois', getPaiementsParClasseEtMois);
router.post('/ajouter', ajouterPaiement);
router.get('/filtrer', getPaiementsParMoisClasseSituation);
router.get('/impayes/classe/:classe/mois/:mois', getPaiementsImpayesParClasseEtMois);

export default router;
