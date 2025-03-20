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
            const [addProduct] = await db.query(`INSERT INTO cart(id, id_users, id_product) VALUES(?, ?, ?)`, [id, userId, idProduct]);
            
            if(addProduct.affectedRows === 1) {
                return response.status(201).json({
                    status: 'success',
                    message: 'product berhasil ditambahkan ke cart'
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

module.exports = { addProduct };