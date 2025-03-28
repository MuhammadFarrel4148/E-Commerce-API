const { nanoid } = require("nanoid");
const db = require('../database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const addProduct = async(request, response) => {
    const userId = request.auth.credentials.id;
    const { idProduct } = request.params;

    try {
        if(!idProduct) {
            return response.status(400).json({
                status: 'fail',
                message: 'input not valid, try again'
            }); 
        };

        const [existProduct] = await db.query(`SELECT * FROM product WHERE id_product = ?`, [idProduct]);

        if(existProduct.length > 0) {
            const id = nanoid(16);
            const [addProduct] = await db.query(`INSERT INTO cart(id_cart, id_users, id_product) VALUES(?, ?, ?)`, [id, userId, idProduct]);
            
            if(addProduct.affectedRows === 1) {
                return response.status(201).json({
                    status: 'success',
                    message: 'product berhasil ditambahkan ke cart',
                    id_cart: id
                });
            };

            return response.status(400).json({
                status: 'fail',
                message: 'product gagal ditambahkan, coba lagi'
            });
        };

        return response.status(404).json({
            status: 'fail',
            message: 'product not found, try again'
        });

    } catch(error) {
        return response.status(500).json({
            status: 'fail',
            message: `Invalid add product: ${error}`
        });
    };
};

const removeProduct = async(request, response) => {
    const { idCart } = request.params;

    try {
        if(!idCart) {
            return response.status(400).json({
                status: 'fail',
                message: 'input not valid, try again'
            });
        };

        const [deleteCart] = await db.query(`DELETE FROM cart WHERE id_cart = ?`, [idCart]);

        if(deleteCart.affectedRows === 1) {
            return response.status(201).json({
                status: 'success',
                message: 'berhasil menghapus product'
            });
        };

        return response.status(404).json({
            status: 'fail',
            message: 'cart not found, try again'
        });

    } catch(error) {
        return response.status(500).json({
            status: 'fail',
            message: `Invalid remove product: ${error}`
        })
    };
};

const viewProduct = async(request, response) => {
    const { title, description } = request.query;

    try {
        let sqlQuery = `SELECT title, description, cost, seller FROM product WHERE 1=1`;
        let sqlParams = [];

        if(title) {
            sqlQuery += ` AND title LIKE ?`;
            sqlParams.push(`%${title}%`);
        };

        if(description) {
            sqlQuery += ` AND description LIKE ?`;
            sqlParams.push(`%${description}%`);
        };

        const [result] = await db.query(sqlQuery, sqlParams);

        return response.status(200).json({
            status: 'success',
            result: result
        });

    } catch(error) {
        return response.status(500).json({
            status: 'fail',
            message: `Invalid view product: ${error}`
        });
    };
};

const checkoutProduct = async(request, response) => {
    const userId = request.auth.credentials.id;
    const { token } = request.body;

    let result = 0;

    try {
        if(!token) {
            return response.status(400).json({
                status: 'fail',
                message: 'input card not valid, try again'
            });
        };

        const [cartProducts] = await db.query(`SELECT * FROM cart WHERE id_users = ?`, [userId]);
        const productId = cartProducts.map(item => item.id_product);
        const [priceProduct] = await db.query(`SELECT * FROM product WHERE id_product IN (?)`, [productId]);
    
        const priceMap = {};
        priceProduct.forEach(product => {
            priceMap[product.id_product] = product.cost;
        });

        cartProducts.forEach(item => {
            const price = priceMap[item.id_product];
            result += price;
        });

        const charge = await stripe.charges.create({
            amount: result,
            currency: 'usd',
            source: token.id,
            description: 'Pembelian Produk'
        });

        return response.status(201).json({
            status: 'success',
            result: {
                id: charge.id,
                amount: charge.amount,
                balance_transaction: charge.balance_transaction,
                currency: charge.currency,
                description: charge.description,
                message: charge.outcome.seller_message,
                receipt_url: charge.receipt_url
            }
        });

    } catch(error) {
        return response.status(500).json({
            status: 'fail',
            message: `Invalid checkout product: ${error}`
        });
    };  
};

module.exports = { addProduct, removeProduct, viewProduct, checkoutProduct };