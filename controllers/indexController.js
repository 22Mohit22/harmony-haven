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

    function formatDate(msgDate) {
        const date = new Date(msgDate);
        const dayDate = date.getDate();
        const month = date.getMonth() +1;
        const year = date.getFullYear();

        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDayDate = dayDate < 10 ? `0${dayDate}` : dayDate;

        return `${formattedDayDate}-${formattedMonth}-${year}`;
    }

    function formatTime(msgTime) {
        const hrsMinSec = msgTime.split('.')[0];
        const timeArr = hrsMinSec.split(':');
        timeArr.pop();

        const finalTime = timeArr.join(':');

        return finalTime;
    }
    
    const messages =  await db.getMsgsByName();
    res.render('index', { user: username, msgs: messages, admin: adminValue, handleTime: formatTime, handleDate: formatDate });
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