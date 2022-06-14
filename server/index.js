const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = process.env.SERVER_PORT

app.use(cookieParser()); 
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));  // application/x-www-form-urlencoded
app.use(bodyParser.json());  // appllication/json
app.use(cors());

app.listen(port, () => console.log(`Listening on ${port}`)); 

app.use('/api/user', require('./router/customerRouter.js'));

app.use('/api/movie', require('./router/movieRouter.js'));

app.use('/api/mail', require('./router/mailRouter.js'));