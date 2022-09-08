const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const schema = new Schema(
  {
    number: Number,
    status: {
      type: String,
      required: true,
      enum: ['initiated', 'received', 'in-kitchen', 'delivery', 'completed', 'rejected'],
      default: 'initiated',
    },
    address: {
      city: { type: String, required: true },
      addr: { type: String, required: true },
      entrance: String,
      floor: String,
      flat: String,
      phone: { type: String, required: true },
      note: String,
    },
    items: [
      {
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        variant: { type: String, required: true },
        price: {
          type: Number,
          required: true,
          get: v => (v / 100).toFixed(2),
          set: v => Math.ceil(v * 100),
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      get: v => (v / 100).toFixed(2),
      set: v => Math.ceil(v * 100),
    },
  },
  {
    statics: {},
    methods: {},
    timestamps: true,
  }
);

schema.plugin(AutoIncrement, { inc_field: 'number' });

module.exports = mongoose.model('Order', schema);
