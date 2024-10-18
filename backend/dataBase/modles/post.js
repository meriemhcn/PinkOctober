const mongoose = require('mongoose');

const Post1Schema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('post1', Post1Schema);