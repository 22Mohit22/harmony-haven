const { body, validationResult } = require("express-validator");
const db = require('../db/queries');

const puzzle = `Four people need to cross a river at night. They have only one flashlight, and at most two people can cross at a time. They all move at different speeds:

Person A can cross the river in 1 minute.
Person B can cross the river in 2 minutes.
Person C can cross the river in 5 minutes.
Person D can cross the river in 10 minutes.
When two people cross together, they must move at the slower person’s pace. The flashlight must be carried back and forth; it cannot be thrown or sent back on its own.

Question:
What is the shortest time in which all four people can get across the river?`

function solvePuzzle(req, res) {
    let username = req.user.first_name + ' ' + req.user.last_name;
    if (req.user && req.user.member_type == 'visitor') {
        res.render('solvePuzzle', {user: username, ques: puzzle, errors: []});
    } else if (req.user.member_type == 'member' || req.user.member_type == 'staff') {
        res.render('error', {user: username, statusCode: 409})
    } else {
        res.render('error', {user: null, statusCode: 403});
    }
}

async function promote(req, res) {
    let username = req.user.first_name + ' ' + req.user.last_name;
    body('answer').isNumeric().withMessage('Answer must be in number only')
    .notEmpty().withMessage('cannot be empty').escape();
    const { answer } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('solvePuzzle', {user: username, ques: puzzle, errors: errors.array()})
    }
    if (answer == 17) {
        await db.updateMembership('member', req.user.id);
        res.redirect('/');
    } else {
        res.render('solvePuzzle', {user: username, ques: puzzle, errors: ['wrong answer'] })
    }
    
}

module.exports = {
    solvePuzzle,
    promote,
}