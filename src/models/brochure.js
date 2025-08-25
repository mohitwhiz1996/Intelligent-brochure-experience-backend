const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brochureSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  imageURLs: [{ type: String, trim: true }], // Array of image URL strings
  aiResponse: {
   type: JSON
  }
}, { timestamps: true });

const Brochure = mongoose.model('Brochure', brochureSchema);
module.exports = Brochure;
