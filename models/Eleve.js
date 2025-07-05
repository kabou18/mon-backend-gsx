import mongoose from 'mongoose';

const eleveSchema = new mongoose.Schema({
  identifiant: String,
  nom: String,
  prenom: String,
  dateNaissance: Date,
  classe: String,
  sexe: String,
});

const Eleve = mongoose.model('Eleve', eleveSchema);

export { Eleve };
