const db = require('../database');
const { isValidEmail, isValidPassword, isMatchPassword } = require('../middleware/inputcheck');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const generateToken = (user) => {
    const token = jwt.sign({ id: user[0].id_users, username: user[0].username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const registerAccount = async(request, response) => {
    const { username, email, password } = request.body;

    try {
        if(!username || !isValidEmail(email) || !isValidPassword(password)) {
            return response.status(400).json({
                status: 'fail',
                message: 'input not valid, try again'
            });
        };

        const [existEmail] = await db.query(`SELECT email FROM users WHERE email = ?`, [email]);
        
        if(existEmail.length > 0) {
            return response.status(400).json({
                status: 'fail',
                message: 'email already registered'
            });
        };
        
        const saltRounds = 10;
        const id_users = nanoid(16);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    
        const [addAccount] = await db.query(`INSERT INTO users(id_users, username, email, password) VALUES(?, ?, ?, ?)`, [id_users, username, email, hashedPassword]);
    
        if(addAccount.affectedRows === 1) {
            return response.status(201).json({
                status: 'success',
                result: {
                    id_users, 
                    username, 
                    email
                }
            });
        };
    
        return response.status(400).json({
            status: 'fail',
            message: 'fail to create account, try again'
        });

    } catch(error) {
        return response.status(500).json({
            status: 'fail',
            message: `Invalid register account: ${error}`
        });
    };
};

const loginAccount = async(request, response) => {
    const { email, password } = request.body;

    try {
        if(!isValidEmail(email) || !isValidPassword(password)) {
            return response.status(400).json({
                status: 'fail',
                message: 'input not valid, try again'
            });
        };

        const [existAccount] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);

        if(existAccount.length > 0) {
            const checkPassword = await isMatchPassword(password, existAccount[0].password);

            if(checkPassword) {
                const token = generateToken(existAccount);

                return response.status(201).json({
                    status: 'success',
                    token,
                    account: {
                        username: existAccount[0].username,
                        email: existAccount[0].email
                    }
                });
            };

            return response.status(400).json({
                status: 'fail',
                message: 'wrong email or password, try again'
            });
        };

        return response.status(404).json({
            status: 'fail',
            message: 'account not found, try again'
        });

    } catch(error) {
        return response.status(500).json({
            status: 'fail',
            message: `Invalid login account: ${error}`
        });
    };
};

const forgotPasswordSendEmail = async(request, response) => {
    const { email } = request.body;

    try {
        if(!isValidEmail(email)) {
            return response.status(400).json({
                status: 'fail',
                message: 'input not valid, try again'
            });
        };

        const [existAccount] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
        
        if(existAccount.length > 0) {
            const codeOTP = nanoid(5);

            const [addCodeOTP] = await db.query(`INSERT INTO codeotp(code, email) VALUES(?, ?)`, [codeOTP, email]);

            if(addCodeOTP.affectedRows === 1) {
                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587, 
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
    
                transporter.sendMail({
                    from: 'E-Commerce',
                    to: email,
                    subject: 'OTP Verification',
                    text: `This is your code OTP: ${codeOTP}, don't share with anyone`
                });

                return response.status(201).json({
                    status: 'success',
                    message: 'code OTP berhasil dikirim, cek email anda'
                });
            };

            return response.status(500).json({
                status: 'fail',
                message: 'gagal mengirimkan code OTP, coba lagi'
            });
        };

        return response.status(400).json({
            status: 'fail',
            message: 'account not found, try again'
        });

    } catch(error) {
        return response.status(500).json({
            status: 'fail',
            message: `Invalid send email: ${error}`
        });
    };
};

const forgotPasswordInputOTP = async(request, response) => {
    const { codeOTP, newPassword } = request.body;

    try {
        if(!codeOTP || !isValidPassword(newPassword)) {
            return response.status(400).json({
                status: 'fail',
                message: 'input not valid, try again'
            });
        };

        const [existCodeOTP] = await db.query(`SELECT * FROM codeotp WHERE code = ?`, [codeOTP]);

        if(existCodeOTP.length > 0) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            await db.query(`DELETE FROM codeotp WHERE code = ?`, [codeOTP]);
            const [updatePassword] = await db.query(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, existCodeOTP[0].email]);

            if(updatePassword.affectedRows === 1) {
                return response.status(201).json({
                    status: 'success',
                    message: 'password berhasil diubah'
                });
            };
        };

        return response.status(404).json({
            status: 'fail',
            message: 'wrong code OTP, try again'
        });

    } catch(error) {
        return response.status(500).json({
            status: 'fail',
            message: `Invalid input OTP: ${error}`
        });
    };
};

module.exports = { registerAccount, loginAccount, forgotPasswordSendEmail, forgotPasswordInputOTP };

