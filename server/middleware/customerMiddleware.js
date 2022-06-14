const jwt = require("jsonwebtoken");
const db = require('../dbconfig');
require('dotenv').config();

module.exports = {
    auth: async (req, res, next) => {
        let token = req.cookies.x_auth;
        jwt.verify(token, process.env.SECRET_TOKEN, (err, userId) => {
            if (err) return res.json({success: false, err });
            db.query('select * from customer where token=? and cid=?', [token, userId], (err, row) => {
                if(row == 0) return res.json({authSuccess: false, message: "Access denied"})
                req.token = token;
                req.customer = row[0];
                next();
            })  
        })
    }
}

