import express from 'express';
import {
  ajouterEleve,
  getAllEleves,
  getEleveById, 	
  modifierEleve,
  supprimerEleve,
} from '../controllers/elevesController.js';

const router = express.Router();

router.post('/', ajouterEleve);          // Ajouter un élève
router.get('/', getAllEleves);          // Liste des élèves
router.put('/:id', modifierEleve);        // Modifier un élève
router.delete('/:id', supprimerEleve);     // Supprimer un élève
router.get('/:id', getEleveById);  

export default router;
