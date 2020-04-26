// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    hostname: process.env.HOSTNAME,
    port: process.env.PORT,
    endpoint: process.env.API_URL,
    masterKey: process.env.API_KEY
};

