import express from 'express';
import { getAllClasses, ajouterClasse } from '../controllers/classeController.js';

const router = express.Router();

router.get('/', getAllClasses);
router.post('/', ajouterClasse);

export default router;
