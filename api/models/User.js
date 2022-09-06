const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const PUBLIC_ATTRIBUTES = ['id', 'username', 'name'];

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    tokens: [{ type: String }],
  },
  {
    statics: {
      publicAttributes: PUBLIC_ATTRIBUTES,
      async encryptPassword(str) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(str, salt);
      },
    },
    methods: {
      getPublicAttributes(attributes = PUBLIC_ATTRIBUTES) {
        const payload = {};
        attributes.forEach(key => {
          payload[key] = this[key];
        });
        return payload;
      },
      confirmPassword(str) {
        return bcrypt.compare(str, this.password);
      },
    },
  }
);

module.exports = mongoose.model('User', userSchema);
