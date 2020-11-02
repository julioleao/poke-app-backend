const Card = require('./cards');
const _ = require('lodash');

Card.methods(['get', 'post', 'put', 'delete']);
Card.updateOptions({ new: true, runValidators: true });

Card.route('get', (req, res, next) => {
  Card.find({}, (err, docs) => {
    if (!err) {
      res.json(docs);
    } else {
      res.status(500).json({ errors: [error] });
    }
  });
});

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];

  _.forIn(dbErrors.errors, (error) => errors.push(error.message));
  return res.status(400).json({ errors });
};

Card.route('search', (req, res, next) => {
  const name = req.query.name;

  Card.find(name ? { name } : {}, (err, card) => {
    res.json(card);
  });
});

module.exports = Card;

/* const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];

  _.forIn(dbErrors.errors, (error) => errors.push(error.message));
  return res.status(400).json({ errors });
};

const list = async (req, res) => {
  const cards = await Card.find({});
  return res.status(200).json(cards);
};

const register = (req, res, next) => {
  const name = req.body.name || '';
  const img = req.body.img || '';

  const newCard = new Card({
    name,
    img,
  });
  return newCard.save((err) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    }
    return list(req, res);
  });
};

module.exports = { register, list }; */
