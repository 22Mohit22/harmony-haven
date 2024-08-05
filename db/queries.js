const pool = require("./pool");

async function getMessages() {
    const { rows } = await pool.query("SELECT * FROM messages;");
    return rows;
}

async function createMsg(message, authorid) {
    await pool.query("INSERT INTO messages (message, authorid) VALUES ($1, $2);", [message, authorid]);
    return
}

async function createUser(firstname, lastname, email, password) {
    await pool.query("INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4);", [firstname, lastname || "", email, password]);
    return;
}

async function checkUser(email) {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1;", [email]);
    const user = rows[0];
    return user;
}

async function deletePost(msg_id) {
    await pool.query("DELETE FROM messages WHERE msg_id = $1;", [msg_id]);
    return;
}

async function getMsgsByName() {
    const { rows } = await pool.query("SELECT messages.author_id, users.first_name, users.last_name, users.member_type, messages.msg_id, messages.msg_title, messages.message, messages.created_time, messages.created_date FROM users INNER JOIN messages ON users.id = messages.author_id ORDER BY created_time DESC;");
    return rows;
}

async function postMessage(author_id, msg_title, message) {
    await pool.query("INSERT INTO messages (author_id, msg_title, message) VALUES ($1, $2, $3);", [author_id, msg_title, message]);
    return;
}

async function updateMembership(member_type, userID) {
    await pool.query("UPDATE users SET member_type = $1 WHERE id = $2;", [member_type, userID]);
    return;
}
module.exports = {
    getMessages,
    getMsgsByName,
    createMsg,
    deletePost,
    postMessage,
    createUser,
    checkUser,
    updateMembership
}