const restful = require('node-restful');
const mongoose = restful.mongoose;

const cardsSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Informe o nome da carta'] },
    img: { type: String, required: [true, 'Insira uma imagem'] },
  },
  {
    timestamps: true,
  }
);

module.exports = restful.model('cards', cardsSchema);
