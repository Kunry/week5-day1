const router = require('express').Router();
const UserModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

/**
 * GET
 */

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
});

/**
 * POST
 */

router.post('/signup', (req, res, next) => {
  const { password, username, email } = req.body;
  console.log(password);
  bcrypt
    .genSalt(10)
    .then((salts) => {
      return bcrypt.hash(password, salts);
    })
    .then((pass) => {
      return UserModel.create({ password: pass, username, email });
    })
    .then((user) => {
      res.redirect('/');
    })
    .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  let user;
  UserModel.findOne({ username })
    .then((userDb) => {
      user = userDb;
      return bcrypt.compare(password, user.password);
    })
    .then((isPassword) => {
      if (isPassword) {
        req.session.user = user;
        res.redirect('/profile');
      } else {
        res.render('auth/login', {
          message: 'Ususario o contraseña incorrectar!',
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});

/**
 * Por si alguien quiere ver como se haría con async/await
 */
/*

router.post('/signup', (req, res, next) => {
  try {
  const { password, username, email } = req.body;
  
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(password, salts);
  
  const user = await UserModel.create({ password: pass, username, email });

  res.redirect('/);

  } catch (err) {
    next(err);
  }
});

router.post('/login', (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    const isPassword = await bcrypt.compare(password, user.password);

    if (isPassword) {
      req.session.user = user;
      res.redirect('/profile');
    } else {
      res.render('auth/login', {message: 'Ususario o contraseña incorrectar!'});
    }


  } catch (err) {
    next(err);
  }
});
*/
module.exports = router;
