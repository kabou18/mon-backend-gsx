import { Eleve } from '../models/Eleve.js';

const ajouterEleve = async (req, res) => {
  try {
    // Logique d'identifiant personnalisée supprimée pour utiliser l'_id de MongoDB
    const nouvelEleve = new Eleve(req.body);
    await nouvelEleve.save();
    res.status(201).json(nouvelEleve);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de l'élève." });
  }
};

const getAllEleves = async (req, res) => {
  try {
    const eleves = await Eleve.find();
    res.status(200).json(eleves);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des élèves.' });
  }
};

const modifierEleve = async (req, res) => {
  const { id } = req.params;
  try {
    const eleveModifie = await Eleve.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(eleveModifie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de l\'élève.' });
  }
};
export const getEleveById = async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id);
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });
    res.json(eleve);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
const supprimerEleve = async (req, res) => {
  const { id } = req.params;
  try {
    await Eleve.findByIdAndDelete(id);
    res.status(200).json({ message: 'Élève supprimé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'élève.' });
  }
};

export { ajouterEleve, getAllEleves, modifierEleve, supprimerEleve };
