const db = require('../dbconfig');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const saltRounds = 10

const getAge = (strDate) => {
    let today = new Date();
    let birthDate = new Date(strDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

const userController = {
    register: async (req, res) => {
        const name = req.body.name;
        const birthDate = req.body.birthDate;
        const sex = req.body.sex;
        const email = req.body.email;
        let password = req.body.password;  // 후에 암호화 처리

        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return res.json({success: false, err });
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) return res.json({registerSuccess: false, err });
                password = hash
                db.query('insert into customer (name, birth_date, sex, email, password) values(?, ?, ?, ?, ?)',
                [name, birthDate, sex, email, password], 
                (err, row) => {
                    if (err) return res.json({registerSuccess: false, err });
                    return res.status(200).json({
                        registerSuccess: true
                    })
                })
            })
        })
    },
    login: async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;
        db.query('select * from customer where email=?', email, (err, row) => {
            if (err) return res.json({success: false, err });
            if (row.length > 0) {
                row.forEach((customer) => {
                    bcrypt.compare(password, customer.password, (err, result) => {
                        if (result) {
                            const token = jwt.sign(customer.cid, process.env.SECRET_TOKEN);  // token 생성
                            db.query('update customer set token=? where cid=?', [token, customer.cid], (err, row) => {  // db에 token update
                                if (err) return res.json({ success: false, err});
                                return res.cookie("x_auth", token)  // token 쿠키에 저장
                                        .status(200)
                                        .json({
                                            loginSuccess: true,
                                            userId: customer.cid,
                                            message: "Login success"
                                        });
                            })
                        } else {
                            return res.json({loginSuccess: false, message: "Login failure"});
                        }
                    })    
                }) 
            } else {
                return res.json({loginSuccess: false, message: "Invalid email or password"});
            }
        })
    },
    logout: async (req, res) => {
        db.query('update customer set token="" where cid=?', req.customer.cid, (err, row) => {
            if (err) return res.json({ logoutSuccess: false, err});
            return res.status(200).json({ logoutSuccess: true})
        })
    },
    authenticate: async (req, res) => {
        return res.status(200).json({
            cid: req.customer.cid,
            role: req.role,
            isAdmin: req.customer.role === 0 ? false : true,
            isAuth: true,
            email: req.customer.email,
            name: req.customer.name,
            age: getAge(req.customer.birth_date)
        });
    }
}

module.exports = userController