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
    description: { type: String },
    prices: [
      {
        variant: { type: String, required: true },
        value: {
          type: Number,
          required: true,
          get: v => (v / 100).toFixed(2),
          set: v => v * 100,
        },
        weight: Number,
      },
    ],
    images: [{ type: String }],
  },
  {
    statics: {},
    methods: {},
    toJSON: { getters: true },
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', userSchema);
