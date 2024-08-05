const { Router } = require("express");
const indexController = require('../controllers/indexController');

const router = Router();

router.get('/', indexController.renderIndex);
router.delete('/delete/:msg_id', indexController.delMsg)

module.exports = router;