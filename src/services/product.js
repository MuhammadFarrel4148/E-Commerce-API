const { nanoid } = require("nanoid");
const db = require('../database');

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

module.exports = { addProduct, removeProduct };