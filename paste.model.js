const mongoose = require('mongoose');

const PasteSchema = new mongoose.Schema(
  {
    id_gen: {
      type: String,
      required: true,
      unique: true
    },
    content: {
      type: String,
      required: true
    },
    created_dt: {
      type: Date,
      default: new Date()
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('paste', PasteSchema);
