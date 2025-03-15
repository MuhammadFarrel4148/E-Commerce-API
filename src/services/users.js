const db = require('../database');
const { isValidEmail, isValidPassword, isMatchPassword } = require('../middleware/inputcheck');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');
const jwt = require('jsonwebtoken');

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

module.exports = { registerAccount, loginAccount };

