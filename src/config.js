const dotenv = require('dotenv');

dotenv.config();

module.exports = {
     BACKEND_URL: process.env.REACT_APP_BACKEND_URL,
     CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
     REDIRECT: process.env.REACT_APP_REDIRECT,
     BASE_NAME: process.env.REACT_APP_BASE_NAME
}

