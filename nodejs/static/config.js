// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    environment: process.env.NODE_ENV,
    hostname: "localhost",//process.env.HOSTNAME,
    port: process.env.PORT,
    endpoint: process.env.API_URL,
    masterKey: process.env.API_KEY
};

