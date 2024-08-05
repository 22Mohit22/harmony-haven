const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

passport.use(new LocalStrategy(
    { usernameField: 'emailId' },
    async (email, password, done) => {
    try {
        const user = await db.checkUser(email);
        if (!user.email) {
            return done(null, false, { message: 'Incorrect email' });
        }
        if (!bcrypt.compare(password, user.password)) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}))

passport.serializeUser((user, done) => {
    process.nextTick( () => {
        return done(null, { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name, member_type: user.member_type});
    })
})

passport.deserializeUser((user, done) => {
    process.nextTick( () => {
        return done(null, user);
    })
})

function signinPage(req, res) {
    res.render('signin', {user: req.body.first_name});
}

function signupPage(req, res) {
    res.render('signup', {user: req.body.first_name, formData: {}, errors: []});
}

async function submitDetails(req, res) {
    const user = req.body;
    bcrypt.hash(user.password, 10, async (err, hash_pass) => {
        if (err) next(err);
        if (hash_pass) await db.createUser(user.firstName, user.lastName || "", user.emailId, hash_pass);
    });
    res.redirect('/');
}

const validateUser = [
    body('firstName').trim().notEmpty().withMessage('First name is required').escape(),
    body('lastName').trim().optional().escape(),
    body('emailId').isEmail().withMessage('Invalid email address').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').trim().escape(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }).trim().escape()
]

function signup(req, res) {
    const errors = validationResult(req);

    let username;
    if (req.body.first_name && errors.isEmpty()) {
        username = req.body.first_name;
    } else {
        username = null;
    }
    if (!errors.isEmpty()){
        res.render('signup', { user: username, formData: req.body, errors: errors.array() });
        return;
    }
    submitDetails(req, res);
}

module.exports = {
    signinPage,
    signupPage,
    signup,
    submitDetails,
    validateUser
}