const mongoose = require('mongoose');

const Post2Schema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    likers: {
      type: [String],
      default: [],
    },
    comments: {
      type: [
        {
          commenterId:String,
          commenterPseudo: String,
          text: String,
          timestamp: Number,
        }
      ],
      default: [],
    },
    linkUrl: {
        type: String, // Utilise String pour stocker un lien URL
        validate: {
          validator: function(v) {
            return /^(ftp|http|https):\/\/[^ "]+$/.test(v); // Validation de l'URL
          },
          message: props => `${props.value} n'est pas un URL valide !`
        },
        required: false // Pas obligatoire, à toi de décider si tu le rends obligatoire
      }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('post2', Post2Schema);