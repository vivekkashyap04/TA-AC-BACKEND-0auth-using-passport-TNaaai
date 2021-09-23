var express = require('express');
var router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/failure', function (req, res, next) {
  res.render('failure');
});

router.get('/success', function (req, res, next) {
  res.render('success');
});

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/failure' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/success');
  }
);

//gihub

router.get('/auth/github', passport.authenticate('github'));

router.get('/auth/github/callback', passport.authenticate('github', 
  { failureRedirect: '/failure' }), (req, res) => {
    res.redirect('/success');
  });
  
//Local

router.get('/login', (req, res) => {
  var error = req.flash('error')[0];
  res.render('login');
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/success',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

// Logout
router.get('/success/logout', (req, res, next) => {
  console.log(req.session);
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/');
}); 

module.exports = router;
