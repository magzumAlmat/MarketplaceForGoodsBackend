// controllers/CartController.js
const { Cart } = require('../models/Order');
const { Product } = require('../models/Product');

async function createCart(req, res) {
    try {
        const { productId, quantity } = req.body;
        const cartId = req.params.cartId;

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const cart = await Cart.findByPk(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Add the product to the cart
        await cart.addProduct(product, { through: { quantity } });

        return res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    createCart,
};
