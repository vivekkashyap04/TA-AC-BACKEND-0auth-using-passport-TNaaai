var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/failure', function (req, res, next) {
  res.render('failure');
});

router.get('/success', function (req, res, next) {
  res.render('sucees');
});

router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/failure' }),
  (req, res) => {
    res.redirect('/success');
  }
);

module.exports = router;
