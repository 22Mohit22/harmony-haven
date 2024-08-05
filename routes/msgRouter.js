const { Router } = require("express");
const msgController = require("../controllers/messageController");

const router = Router();

router.get('/new', msgController.createMsgForm);

router.post('/new', msgController.validateMsg, msgController.submitMsgDetails);

module.exports = router;