import Eleve from '../models/Eleve.js';
import Paiement from '../models/Paiement.js';

// Statistiques globales pour le dashboard
export const getStatistiques = async (req, res) => {
  try {
    // Total élèves
    const totalEleves = await Eleve.countDocuments();

    // Total paiements (nombre d'enregistrements)
    const totalPaiements = await Paiement.countDocuments();

    // Total des inscriptions
    const inscriptionsAgg = await Paiement.aggregate([
      { $match: { type: "inscription" } },
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);
    const totalInscriptions = inscriptionsAgg[0]?.total || 0;

    // Total des mensualités
    const mensualitesAgg = await Paiement.aggregate([
      { $match: { type: "mensualite" } },
      { $group: { _id: null, total: { $sum: "$montant" } } }
    ]);
    const totalMensualites = mensualitesAgg[0]?.total || 0;

    // Total global
    const totalGlobal = totalInscriptions + totalMensualites;

    // Élèves par classe (objet { classe: nombre })
    const elevesParClasseAgg = await Eleve.aggregate([
      { $group: { _id: "$classe", count: { $sum: 1 } } }
    ]);
    const parClasse = {};
    elevesParClasseAgg.forEach(e => {
      parClasse[e._id] = e.count;
    });

    // Impayés : nombre d'élèves qui n'ont aucun paiement enregistré
    const allEleves = await Eleve.find({}, '_id');
    const allPaiements = await Paiement.find({}, 'eleveId');
    const elevePayesSet = new Set(allPaiements.map(p => String(p.eleveId)));
    const impayes = allEleves.filter(e => !elevePayesSet.has(String(e._id))).length;

    res.json({
      totalInscriptions,
      totalMensualites,
      totalGlobal,
      totalPaiements,
      totalEleves,
      parClasse,
      impayes
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques", error });
  }
};


// Statistiques par classe
export const getStatistiquesParClasse = async (req, res) => {
  try {
    const classe = req.params.classe;
    const eleves = await Eleve.find({ classe });
    const paiements = await Paiement.find({ classe });

    const totalMontant = paiements.reduce((acc, paiement) => acc + paiement.montant, 0);

    res.json({
      classe,
      nombreEleves: eleves.length,
      nombrePaiements: paiements.length,
      totalMontant
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des statistiques par classe", error });
  }
};

// Élèves par classe (liste brute)
export const getElevesParClasse = async (req, res) => {
  try {
    const eleves = await Eleve.aggregate([
      { $group: { _id: "$classe", count: { $sum: 1 } } }
    ]);
    res.json(eleves);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'agrégation des élèves par classe", error });
  }
};

// Paiements par classe (liste brute)
export const getPaiementsParClasse = async (req, res) => {
  try {
    const paiements = await Paiement.aggregate([
      { $group: { _id: "$classe", total: { $sum: "$montant" } } }
    ]);
    res.json(paiements);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'agrégation des paiements par classe", error });
  }
};

// Paiements par mois (liste brute)
export const getPaiementsParMois = async (req, res) => {
  try {
    const paiements = await Paiement.aggregate([
      {
        $group: {
          _id: { $month: "$date" },
          total: { $sum: "$montant" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(paiements);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'agrégation des paiements par mois", error });
  }
};

// Alias pour compatibilité route /total
export const getTotalPaiements = getStatistiques;