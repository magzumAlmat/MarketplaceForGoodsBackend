const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
    }

    const { productId, quantity = 1 } = req.body;
    if (!productId || quantity < 1) {
      return res.status(400).json({ message: 'Необходим productId и quantity >= 1' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }

    let cartItem = await Cart.findOne({
      where: { userId: req.user.id, productId },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId: req.user.id,
        productId,
        quantity,
      });
    }

    return res.status(200).json(cartItem);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при добавлении в корзину', error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
    }

    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, attributes: ['id', 'title', 'price'] }],
    });

    return res.status(200).json(cartItems);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при получении корзины', error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Необходим productId' });
    }

    const cartItem = await Cart.findOne({
      where: { userId: req.user.id, productId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Товар не найден в корзине' });
    }

    await cartItem.destroy();
    return res.status(200).json({ message: 'Товар удалён из корзины' });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при удалении из корзины', error: error.message });
  }
};