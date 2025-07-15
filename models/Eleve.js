import mongoose from 'mongoose';

const eleveSchema = new mongoose.Schema({
  matricule: {
    type: String,
    unique: true,
    required: true,
  },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  dateNaissance: { type: Date, required: true },
  lieuNaissance: { type: String, required: true },
  sexe: { type: String, required: true, enum: ['Masculin', 'Féminin'] },
  classe: { type: String, required: true },
  nomTuteur: { type: String, required: true },
  prenomTuteur: { type: String, required: true },
  telephoneTuteur: { type: String, required: true },
  emailTuteur: { type: String, required: true },
  adresse: { type: String, required: true },
}, { timestamps: true });

const Eleve = mongoose.model('Eleve', eleveSchema);

export { Eleve };
