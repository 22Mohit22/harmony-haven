require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const pgsession = require('connect-pg-simple')(session);
const path = require('path');

const app = express();

const db = require('./db/pool');
const indexRouter = require('./routes/indexRouter');
const authRouter = require('./routes/authRouter');
const msgRouter = require('./routes/msgRouter');
const membershipRouter = require('./routes/membershipRouter');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: "tat_tvam_asi",
    resave: false,
    saveUninitialized: false,
    store: new pgsession({
        pool: db,
        tableName: "user_sessions",
        createTableIfMissing: true
    })
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', msgRouter);
app.use('/', membershipRouter);
app.get('*', (req, res) => {
    const username = req.user.first_name + ' ' + req.user.last_name;
    res.render('error', {user: username, statusCode: 404});
})

PORT = process.env.PORT;

app.listen(PORT, console.log('Running'));