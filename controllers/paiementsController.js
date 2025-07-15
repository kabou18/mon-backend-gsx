import Paiement from '../models/Paiement.js';
import { Eleve } from '../models/Eleve.js';

// Création d'un paiement simple
export const createPaiement = async (req, res) => {
  try {
    const paiement = new Paiement(req.body);
    await paiement.save();
    res.status(201).json(paiement);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du paiement.' });
  }
};

// Liste de tous les paiements
export const getAllPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find().populate('eleveId');
    res.status(200).json(paiements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements.' });
  }
};

// Paiements filtrés par mois
export const getPaiementsParMois = async (req, res) => {
  const { mois } = req.params;
  try {
    const paiements = await Paiement.find({ mois }).populate('eleveId');
    res.status(200).json(paiements);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements.' });
  }
};

// Paiements d'une classe pour un mois donné
export const getPaiementsParClasseEtMois = async (req, res) => {
  const { classe, mois } = req.params;
  try {
    const paiements = await Paiement.find({ mois }).populate({
      path: 'eleveId',
      match: { classe }
    });

    const paiementsFiltres = paiements.filter(p => p.eleveId !== null);
    res.status(200).json(paiementsFiltres);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements par classe et mois.' });
  }
};

// Élèves d'une classe qui n'ont pas payé pour un mois donné
export const getPaiementsImpayesParClasseEtMois = async (req, res) => {
  const { classe, mois } = req.params;
  try {
    const paiements = await Paiement.find({ mois }).populate({
      path: 'eleveId',
      match: { classe },
    });

    const elevesPayes = paiements
      .filter(p => p.eleveId !== null)
      .map(p => p.eleveId._id.toString());

    const elevesImpayes = await Eleve.find({ classe, _id: { $nin: elevesPayes } });
    res.status(200).json(elevesImpayes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des impayés.' });
  }
};

// Ajouter un paiement par eleveId
export const ajouterPaiement = async (req, res) => {
  try {
    const { eleveId, mois, montant, type } = req.body;

    const eleve = await Eleve.findById(eleveId);
    if (!eleve) return res.status(404).json({ message: "Élève non trouvé" });

    // Vérifier doublon seulement pour les mensualités
    if(type === "mensualite") {
      const paiementExistant = await Paiement.findOne({ eleveId: eleve._id, mois, type: "mensualite" });
      if (paiementExistant) return res.status(400).json({ message: "Paiement déjà enregistré pour ce mois" });
    }
    if(type === "inscription") {
      const paiementExistant = await Paiement.findOne({ eleveId: eleve._id, type: "inscription" });
      if (paiementExistant) return res.status(400).json({ message: "Inscription déjà enregistrée pour cet élève" });
    }

    const paiement = new Paiement({
      eleveId: eleve._id,
      mois: type === "mensualite" ? mois : undefined,
      montant,
      type
    });
    await paiement.save();

    res.status(201).json(paiement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Filtrage combiné : mois, classe, situation
export const getPaiementsParMoisClasseSituation = async (req, res) => {
  try {
    const { mois, classe, situation, type } = req.query;

    let eleveFilter = {};
    if (classe && classe !== 'tout') eleveFilter.classe = classe;

    const eleves = await Eleve.find(eleveFilter);
    const eleveIds = eleves.map(e => e._id);

    let paiementFilter = {};
    if (type) {
      paiementFilter.type = type;
    } else if (mois && mois !== 'tout') {
      paiementFilter.mois = mois;
    }
    if (eleveIds.length > 0) paiementFilter.eleveId = { $in: eleveIds };

    const paiements = await Paiement.find(paiementFilter).populate('eleveId');

    // Création d'une liste enrichie
    const liste = eleves.map((eleve) => {
      const paiement = paiements.find(p => p.eleveId && p.eleveId._id.toString() === eleve._id.toString());
      const aPaye = Boolean(paiement);

      return {
        _id: eleve._id,
        nom: eleve.nom,
        prenom: eleve.prenom,
        classe: eleve.classe,
        mois: paiement?.mois || '',
        type: paiement?.type || '',
        montant: aPaye ? paiement.montant : 0,
        situation: aPaye ? 'Payé' : 'Non payé',
      };
    });

    const resultats =
      situation === 'Payé' ? liste.filter(l => l.situation === 'Payé')
      : situation === 'Non payé' ? liste.filter(l => l.situation === 'Non payé')
      : liste;

    res.json(resultats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};