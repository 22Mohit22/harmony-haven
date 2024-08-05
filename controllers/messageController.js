const { body, validationResult } = require('express-validator');
const db = require('../db/queries');

async function createMsgForm(req, res) {
    let username;
    if (req.user) username = req.user.first_name + " " + req.user.last_name;
    if (req.user && req.user.member_type !== 'visitor') {
        res.render('createMsg', {user: username, formData: {}, errors: [] })
    } else if (req.user.member_type == 'visitor') {
        res.render('error', {user: username, statusCode: 401});
    } else {
        res.render('error', {user: null, statusCode: 403});
    }
}

const validateMsg = [
    body("title").isLength({min: 5}).withMessage("Title must be atleast 5 characters long")
    .notEmpty().withMessage("Title cannot be empty"),
    body("new_msg").isLength({min: 2}). withMessage("Message must at least 2 characters long")
    .notEmpty().withMessage("Message cannot be empty")
]

async function submitMsgDetails(req, res) {

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        res.render('createMsg', 
            {user: req.user.first_name + " " + req.user.last_name, 
                formData: req.body, 
                errors: errors.array()
            });
            return;
    }

    const msgData = req.body;
    await db.postMessage(req.user.id, msgData.title, msgData.new_msg);
    res.redirect('/');
}

module.exports = {
    createMsgForm,
    submitMsgDetails,
    validateMsg
}