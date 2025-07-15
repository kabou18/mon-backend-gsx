import { Eleve } from '../models/Eleve.js';
import Counter from '../models/Counter.js';

// Fonction pour obtenir la prochaine valeur de la séquence et la formater
async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findByIdAndUpdate(
    sequenceName,
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value.toString().padStart(5, '0');
}

const ajouterEleve = async (req, res) => {
  try {
    const matricule = await getNextSequenceValue('eleveId');
    const nouvelEleve = new Eleve({
      ...req.body,
      matricule: matricule
    });
    const eleveEnregistre = await nouvelEleve.save();
    res.status(201).json(eleveEnregistre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllEleves = async (req, res) => {
  try {
    const eleves = await Eleve.find().sort({ matricule: 1 });
    res.status(200).json(eleves);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des élèves.' });
  }
};

const getEleveById = async (req, res) => {
  try {
    const eleve = await Eleve.findById(req.params.id);
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });
    res.json(eleve);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const modifierEleve = async (req, res) => {
  const { id } = req.params;
  try {
    // On ne permet pas la modification du matricule
    const updateData = { ...req.body };
    delete updateData.matricule;

    const eleveModifie = await Eleve.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(eleveModifie);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de l\'élève.' });
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

export { ajouterEleve, getAllEleves, getEleveById, modifierEleve, supprimerEleve };
