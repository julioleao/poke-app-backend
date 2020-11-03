const User = require('./users');

const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const emailRegex = /\S+@\S+\.\S+/;
const passwordRegex = /((?=.*$).{4,12})/;

const sendErrorsFromDB = (res, dbErrors) => {
  const errors = [];

  _.forIn(dbErrors.errors, (error) => errors.push(error.message));
  return res.status(400).json({ errors });
};

const login = (req, res, next) => {
  const email = req.body.email || '';
  const password = req.body.password || '';

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    } else if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ ...user }, process.env.AUTH_SECRET, {
        expiresIn: '1 day',
      });
      const { name, email, isAdmin } = user;
      res.json({ name, email, token, isAdmin });
    } else {
      return res.status(400).send({ errors: ['Usuário ou Senha inválidos'] });
    }
  });
};

const validateToken = (req, res, next) => {
  const token = req.body.token || '';

  jwt.verify(token, process.env.AUTH_SECRET, function (err, decoded) {
    return res.status(200).send({ valid: !err });
  });
};

const signup = (req, res, next) => {
  const name = req.body.name || '';
  const email = req.body.email || '';
  const password = req.body.password || '';
  const confirmPassword = req.body.confirmPassword || '';
  const isAdmin = req.body.isAdmin || false;

  if (!name) {
    return res.status(400).send({ errors: ['Informe seu nome'] });
  }

  if (!email.match(emailRegex)) {
    return res.status(400).send({ errors: ['E-mail inválido'] });
  }

  if (!password.match(passwordRegex)) {
    return res.status(400).send({
      errors: ['Senha precisar ter entre 4-12 caracteres'],
    });
  }

  const salt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, salt);

  if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
    return res.status(400).send({ errors: ['Senhas não conferem.'] });
  }

  User.findOne({ email }, (err, user) => {
    if (err) {
      return sendErrorsFromDB(res, err);
    } else if (user) {
      return res.status(400).send({ errors: ['Usuário já cadastrado.'] });
    } else {
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        isAdmin,
      });
      newUser.save((err) => {
        if (err) {
          return sendErrorsFromDB(res, err);
        } else {
          login(req, res, next);
        }
      });
    }
  });
};

module.exports = { login, signup, validateToken };
