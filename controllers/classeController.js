import Classe from '../models/Classe.js';

const getAllClasses = async (req, res) => {
  try {
    const classes = await Classe.find();
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des classes.' });
  }
};

const ajouterClasse = async (req, res) => {
  try {
    const nouvelleClasse = new Classe(req.body);
    await nouvelleClasse.save();
    res.status(201).json(nouvelleClasse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la classe.' });
  }
};

export { getAllClasses, ajouterClasse };
