// src/controllers/orderController.js
const  Product  = require('../models/Product');
const Order =require('../models/Order')
const User = require('../models/User');
const Cart = require('../models/Cart');
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при получении заказов', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    // Проверяем, принадлежит ли заказ пользователю, если он не админ
    // Предполагаем, что модель Order имеет поле userId (нужно добавить в миграцию, если отсутствует)
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Доступ запрещён: это не ваш заказ' });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при получении заказа', error: error.message });
  }
};

// exports.createOrder = async (req, res) => {
//   try {
//     const { productIds, username, address, phone, status } = req.body;
//     console.log('create order data= ' ,productIds, username, address, phone, status)
//     // Валидация
//     if (!productIds || !Array.isArray(productIds) || !username || !address || !phone) {
//       return res.status(400).json({ message: 'Необходимы productIds, username, address и phone' });
//     }

//     // Проверяем, что продукты существуют и рассчитываем общую цену
//     const products = await Product.findAll({
//       where: { id: productIds },
//     });
//     console.log('products= ',products)
//     if (products.length !== productIds.length) {
//       return res.status(400).json({ message: 'Один или несколько продуктов не найдены' });
//     }
//     const totalPrice = products.reduce((sum, product) => sum + parseFloat(product.price), 0);

//     // Формируем product_ids как массив массивов для PostgreSQL
//     const formattedProductIds = productIds.map((id) => [id]);

//     // Создаём заказ
//     const order = await Order.create({
//       product_ids: formattedProductIds,
//       username,
//       address,
//       phone,
//       status: status || 'pending',
//       totalPrice,
//       // userId: req.user.id, 
//       userId:1
//     });

//     return res.status(201).json(order);
//   } catch (error) {
//     return res.status(500).json({ message: 'Ошибка при создании заказа', error: error.message });
//   }
// };



exports.createOrder = async (req, res) => {
  try {
    console.log('req.user=', req.user);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
    }

    // Получаем корзину
    const cartItems = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, attributes: ['id', 'price'] }],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Корзина пуста' });
    }

    // Формируем productIds и проверяем продукты
    const productIds = cartItems.map(item => item.productId);
    const products = await Product.findAll({
      where: { id: productIds },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: 'Один или несколько продуктов не найдены' });
    }

    // Рассчитываем totalPrice с учётом количества
    const totalPrice = cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + parseFloat(product.price) * item.quantity;
    }, 0);

    // Получаем данные пользователя
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверяем наличие личных данных пользователя
    if (!user.username || !user.address || !user.phone) {
      return res.status(400).json({
        message: 'Необходимы username, address и phone. Пожалуйста, заполните профиль.',
        redirect: '/profile', // Подсказка для фронтенда
      });
    }

    // Формируем product_ids
    const formattedProductIds = productIds.map(id => [id]);

    // Создаём заказ
    const order = await Order.create({
      product_ids: formattedProductIds,
      username: user.username,
      address: user.address,
      phone: user.phone,
      status: 'pending',
      totalPrice,
      userId: req.user.id,
    });

    // Очищаем корзину
    await Cart.destroy({ where: { userId: req.user.id } });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при создании заказа', error: error.message });
  }
};



exports.editOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { productIds, username, address, phone, status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    let totalPrice = order.totalPrice;
    let formattedProductIds = order.product_ids;

    // Если переданы новые productIds, проверяем продукты и пересчитываем цену
    if (productIds && Array.isArray(productIds)) {
      const products = await Product.findAll({
        where: { id: productIds },
      });
      if (products.length !== productIds.length) {
        return res.status(400).json({ message: 'Один или несколько продуктов не найдены' });
      }
      totalPrice = products.reduce((sum, product) => sum + parseFloat(product.price), 0);
      formattedProductIds = productIds.map((id) => [id]);
    }

    // Обновляем заказ
    await order.update({
      product_ids: formattedProductIds,
      username: username || order.username,
      address: address || order.address,
      phone: phone || order.phone,
      status: status || order.status,
      totalPrice,
    });

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при обновлении заказа', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Необходимо указать статус' });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    await order.update({ status });

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при обновлении статуса заказа', error: error.message });
  }
};

exports.deleteOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }
    await order.destroy();
    return res.status(200).json({ message: 'Заказ удалён' });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при удалении заказа', error: error.message });
  }
};
