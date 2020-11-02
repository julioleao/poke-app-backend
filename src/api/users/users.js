const restful = require('node-restful');
const mongoose = restful.mongoose;

const usersSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, min: 4, max: 12, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = restful.model('users', usersSchema);
