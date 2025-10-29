const Product = require('../app/store/models/Product');
const img_cable = '/public/cable/img_cable.png';
const vvg = '/public/cable/img_cable.png';
const img_cross = '/public/cable/cros_optical.png';
const image_def = '/public/cable/cros_optical.png';
const image_patch1 = '/public/cable/cros_optical.png';
const image_patch2 = '/public/cable/cros_optical.png';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create categories
    const categories = [
      // { name: 'Купание', createdAt: new Date(), updatedAt: new Date() },
      // { name: 'Уход', createdAt: new Date(), updatedAt: new Date() },
      // { name: 'Защита', createdAt: new Date(), updatedAt: new Date() },
      // { name: 'Средства для мамы', createdAt: new Date(), updatedAt: new Date() },
      // { name: 'Органическая линейка', createdAt: new Date(), updatedAt: new Date() },
      // { name: 'Другое', createdAt: new Date(), updatedAt: new Date() },






    ];

    await queryInterface.bulkInsert('categories', categories, {});

    // Category mapping for convenience (assuming IDs start at 1)
    const categoryMap = {
      // 'Купание': 1,
      // 'Уход': 2,
      // 'Защита': 3,
      // 'Средства для мамы': 4,
      // 'Органическая линейка': 5,
      // 'Другое': 6,
    "Все товары":1, 
    "Чехлы":2,
    "Зарядные устройства":3,
    "Зарядные устройства Iphone":4,
    "Зарядные устройства Samsung":5,
    "Держатели устойства":6,
    "Наушники беспроводные":7,
    "Наушники проводные":8,
    "Smart-часы и аксессуары":9,
    "Защитные стекла":10,
    "Портативная зарядка(Power Bank)":11,
    "Гидрогелевые пленки":12,
    "Шатативы":13,
    "Фото-видео свет":14,
    "Чехлы для планшетов":15,
    "Внешник накопители":16,
    "Автомобильные аксессуары":17,
    "Петличный микрофон":18,
    "Переферийные устройства":19,
    "Сумки":20,
    "Другое":21,
    "Премиум":22








      
    };

    // 2. Create products (removed `image` field)
    const products = [
     
    ];

    await queryInterface.bulkInsert('products', products, {});


    // 3. Create product images
    const productImages = [
     
    ];

    await queryInterface.bulkInsert('product_images', productImages, {});

    // 4. Create product-category relationships
    const productCategories = [
     
    ];

    await queryInterface.bulkInsert('product_categories', productCategories, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_categories', null, {});
    await queryInterface.bulkDelete('product_images', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};