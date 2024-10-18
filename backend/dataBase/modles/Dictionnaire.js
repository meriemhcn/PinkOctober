const mongoose = require('mongoose');

const DictionarySchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    definition: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true 
  }
);

module.exports = mongoose.model('Dictionary', DictionarySchema);
