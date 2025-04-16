// controllers/OrderController.js
const Orders = require('../models/Order');
const {Op} = require("sequelize");
const OrderProduct = require('../models/OrderProduct');

async function createOrder  (req, res)  {
  try {
    const { username, phone, address, status, totalPrice, products } = req.body;

    // Валидация входных данных
    if (!username || !phone || !address || !status || !totalPrice || !products || !Array.isArray(products)) {
      return res.status(400).json({ message: 'Все поля обязательны, и products должен быть массивом' });
    }

    // Создаём заказ
    const order = await Orders.create({
      username,
      phone,
      address,
      status,
      totalPrice,
    });

    // Подготавливаем данные для OrderProduct
    const orderProducts = products.map((product) => ({
      orderId: order.id,
      productId: product.id,
      count: product.count,
    }));

    // Проверяем, что все товары имеют корректные ID и количество
    for (const product of orderProducts) {
      if (!product.productId || !product.count || product.count < 1) {
        return res.status(400).json({ message: 'Некорректные данные о товарах' });
      }
    }

    // Создаём записи в таблице OrderProduct
    await OrderProduct.bulkCreate(orderProducts);

    // Возвращаем успешный ответ
    res.status(201).json({
      message: 'Заказ успешно создан',
      order: {
        id: order.id,
        username: order.username,
        phone: order.phone,
        address: order.address,
        status: order.status,
        totalPrice: order.totalPrice,
        products: orderProducts,
      },
    });
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};
// async function createOrder(req, res) {
//     console.log('createOrder started')
//     try {
//         const { product_ids, username, address, phone, status, totalPrice } = req.body;
//         console.log('Request body:', req.body);

//         // Валидация
//         if (!username || !address || !phone || !status || !totalPrice) {
//             return res.status(400).json({ error: 'All fields except product_ids are required' });
//         }
//         if (product_ids && !Array.isArray(product_ids)) {
//             return res.status(400).json({ error: 'product_ids must be an array' });
//         }

//         const newOrder = await Orders.create({
//             product_ids,
//             username,
//             address,
//             phone,
//             status,
//             totalPrice: parseFloat(totalPrice), // Убедимся, что это число
//         });

//         return res.status(201).json(newOrder);
//     } catch (error) {
//         console.error('Error in createOrder:', error.message, error.stack);
//         return res.status(500).json({ error: error.message });
//     }
// }

async function editOrder(req, res) {
    const orderId = req.params.id
    console.log(req.body, req.params.id)
    try {
        Orders.update({
            username: req.body.username,
            phone: req.body.phone,
            address: req.body.address,
            status: req.body.status,
            totalPrice: req.body.totalPrice,
        }, {
            where: { id: orderId },
            returning: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAllOrders(req, res) {
    console.log('getAllorders started')
    try {
        const orders = await Orders.findAll();
        return res.status(200).json(orders);
    } catch (er) {
        console.log(er)
        return res.status(500).json({error: 'Internal Server Error'})
    }
}

const getOrderById = async (req, res) => {
    const {id} = req.params;

    try {
        const order = await Orders.findAll({
            where: {
                id: {
                    [Op.eq]: id,
                }
            }
        });
        return res.status(200).json(order);
    } catch (er) {
        console.log(er)
        return res.status(500).json({error: 'Internal Server Error'})
    }

}


const deleteOrderById = async (req, res) => {
    const { id } = req.params;
    try {
      // Ищем продукт по идентификатору и удаляем его
      const order = await Orders.destroy({
        where: { id: id },
      });
  
      // Если продукт не найден, возвращаем ошибку
      if (!order) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Возвращаем успешный статус и информацию об удаленном продукте
      return res.status(200).json({
        message: "Product deleted successfully",
        deletedOrder: order,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
module.exports = {
    getOrderById,
    getAllOrders,
    createOrder,
    editOrder,
    deleteOrderById
}
