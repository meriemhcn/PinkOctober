const mongoose = require('mongoose');

const CenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
      },
      commune: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
      },
      wilaya: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
      }
    },
    gpsLink: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: props => `${props.value} n'est pas un URL valide !`
      }
    },
    website: {
      type: String,
      required: false,
      validate: {
        validator: function(v) {
          return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        },
        message: props => `${props.value} n'est pas un URL valide !`
      }
    },
    // Nouveau champ pour indiquer si c'est un hôpital public ou une clinique privée
    type: {
      type: String,
      enum: ['public', 'privé'], // Enum pour choisir entre public ou privé
      required: true // Ce champ est obligatoire
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Center', CenterSchema);
