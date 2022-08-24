const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['pizza', 'starters', 'chicken', 'desserts', 'drinks'],
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      get: v => (v / 100).toFixed(2),
      set: v => v * 100,
    },
  },
  {
    statics: {},
    methods: {},
    toJSON: { getters: true },
  }
);

module.exports = mongoose.model('Product', userSchema);
