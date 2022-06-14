const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PW
    }
});

const mailOptions = (to, html) => {
    return {
        from: process.env.GMAIL,
        to: to,
        subject: "CNU CINEMA 영화 예매 정보",
        html: html
    }
};

const mailController = {
    sendMail: async (req, res) => {
        transporter.sendMail(mailOptions(req.body.email, req.body.html), (error, info) => {
            if (error) {
                return res.json({success: false, message: error});
            } else {
                return res.json({success: true, message: info.response});
            }
        })
    }
}

module.exports = mailController