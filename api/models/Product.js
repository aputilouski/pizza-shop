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
    },
  },
  {
    statics: {},
    methods: {},
  }
);

module.exports = mongoose.model('Product', userSchema);
