// src/controllers/orderController.js
const { Order, Product } = require('../models');

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

exports.createOrder = async (req, res) => {
  try {
    const { productIds, username, address, phone, status } = req.body;

    // Валидация
    if (!productIds || !Array.isArray(productIds) || !username || !address || !phone) {
      return res.status(400).json({ message: 'Необходимы productIds, username, address и phone' });
    }

    // Проверяем, что продукты существуют и рассчитываем общую цену
    const products = await Product.findAll({
      where: { id: productIds },
    });
    if (products.length !== productIds.length) {
      return res.status(400).json({ message: 'Один или несколько продуктов не найдены' });
    }
    const totalPrice = products.reduce((sum, product) => sum + parseFloat(product.price), 0);

    // Формируем product_ids как массив массивов для PostgreSQL
    const formattedProductIds = productIds.map((id) => [id]);

    // Создаём заказ
    const order = await Order.create({
      product_ids: formattedProductIds,
      username,
      address,
      phone,
      status: status || 'pending',
      totalPrice,
      userId: req.user.id, // Предполагаем, что userId берётся из JWT
    });

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