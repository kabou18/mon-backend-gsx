import mongoose from 'mongoose';

const classeSchema = new mongoose.Schema({
  nom: String
});

export default mongoose.model('Classe', classeSchema);
