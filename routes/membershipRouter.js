const { Router } = require("express");
const membershipController = require('../controllers/membership')

const router = Router();

router.get('/membership', membershipController.solvePuzzle);
router.post('/membership', membershipController.promote);

module.exports = router;