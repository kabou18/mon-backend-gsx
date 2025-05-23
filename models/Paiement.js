import mongoose from 'mongoose';

const paiementSchema = new mongoose.Schema({
  eleveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleve',
    required: true
  },
  mois: {
    type: String,
    required: false // Non requis pour les inscriptions
  },
  montant: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['inscription', 'mensualite'],
    required: true
  },
  date_paiement: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Paiement', paiementSchema);