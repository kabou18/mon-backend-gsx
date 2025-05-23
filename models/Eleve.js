import mongoose from 'mongoose';

const eleveSchema = new mongoose.Schema({
  identifiant: String,
  nom: String,
  prenom: String,
  dateNaissance: Date,
  classe: String,
  sexe: String,
});

export default mongoose.model('Eleve', eleveSchema);
