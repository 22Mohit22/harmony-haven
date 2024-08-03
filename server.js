require('dotenv').config();
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('hello');
})

PORT = process.env.PORT;

app.listen(PORT, console.log('Running'));