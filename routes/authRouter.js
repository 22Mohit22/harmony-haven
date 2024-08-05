const { Router } = require("express");
const auth = require('../controllers/auth');
const passport = require("passport");

const router = Router();

router.get('/signin', auth.signinPage);
router.get('/signup', auth.signupPage);

router.post('/signin', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin"
}));

router.post('/signup', auth.validateUser, auth.signup);

router.post('/signout', (req, res, next) => {
    req.logout( (err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    })
})

module.exports = router;