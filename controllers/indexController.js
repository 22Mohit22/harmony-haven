const moment = require('moment');
const db = require('../db/queries');

async function renderIndex(req, res) {
    let username;
    if (req.user) {
        username = req.user.first_name + " " + req.user.last_name;
    } else {
        username = null;
    }

    let adminValue = false;
    if (req.user && req.user.member_type == 'staff') {
        adminValue = true;
    }

    function formatTime(msgTime) {
        const time = moment(msgTime).calendar();
        return time;
    }
    
    const messages =  await db.getMsgsByName();
    res.render('index', { user: username, msgs: messages, admin: adminValue, handleTime: formatTime });
}

async function delMsg(req, res) {

    if (req.user && req.user.member_type == 'staff') {
        const msg_id = req.params.msg_id;
    
        await db.deletePost(msg_id);
        res.redirect('/');
    } else {
        res.redirect('/');
    }

}

module.exports = {
    renderIndex,
    delMsg
}