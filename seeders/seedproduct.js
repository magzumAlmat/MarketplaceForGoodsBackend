// seedProduct.js
const img_cable = '/public/cable/img_cable.png';
const vvg = '/public/cable/img_cable.png';
const img_cross = '/public/cable/cros_optical.png';
const image_def = '/public/cable/cros_optical.png';
const image_patch1 = '/public/cable/cros_optical.png';
const image_patch2 = '/public/cable/cros_optical.png';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Создаём категории
    const categories = [
      { name: 'Все товары', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Чехлы', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Зарядные устройства', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Зарядные устройства Iphone', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Зарядные устройства Samsung', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Держатели устойства', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Наушники беспроводные', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Наушники проводные', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Smart-часы и аксессуары', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Защитные стекла', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Портативная зарядка(Power Bank)', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Гидрогелевые пленки', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Шатативы', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Фото-видео свет', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Чехлы для планшетов', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Внешник накопители', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Автомобильные аксессуары', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Петличный микрофон', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Переферийные устройства', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Сумки', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Другое', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Премиум', createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('categories', categories, {});

    // Маппинг: имя → ID (после вставки)
    const categoryMap = {};
    const insertedCategories = await queryInterface.select(null, 'categories', {
      order: [['id', 'ASC']]
    });
    insertedCategories.forEach((cat, index) => {
      categoryMap[categories[index].name] = cat.id;
    });

    // 2. Создаём товары
    const products = [
      {
        name: 'Чехол силиконовый для iPhone 15 Pro',
        description: 'Прочный и стильный чехол из мягкого силикона.',
        price: 1490,
        stock: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Зарядное устройство 20W USB-C',
        description: 'Быстрая зарядка для iPhone и iPad.',
        price: 2290,
        stock: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Наушники AirPods Pro 2',
        description: 'Беспроводные наушники с шумоподавлением.',
        price: 24990,
        stock: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Power Bank 20000mAh',
        description: 'Портативная зарядка с быстрой зарядкой.',
        price: 3990,
        stock: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Защитное стекло 9H для Samsung S24',
        description: 'Ультратонкое, с олеофобным покрытием.',
        price: 890,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert('products', products, {});

    // Получаем ID вставленных товаров
    const insertedProducts = await queryInterface.select(null, 'products', {
      order: [['id', 'ASC']]
    });

    // 3. Изображения товаров
    const productImages = [
      { productId: insertedProducts[0].id, imageUrl: img_cable, isMain: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[0].id, imageUrl: vvg, isMain: false, createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[1].id, imageUrl: img_cross, isMain: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[2].id, imageUrl: image_def, isMain: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[3].id, imageUrl: image_patch1, isMain: true, createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[4].id, imageUrl: image_patch2, isMain: true, createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('product_images', productImages, {});

    // 4. Связи товар ↔ категория
    const productCategories = [
      // Чехол
      { productId: insertedProducts[0].id, categoryId: categoryMap['Чехлы'], createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[0].id, categoryId: categoryMap['Все товары'], createdAt: new Date(), updatedAt: new Date() },

      // Зарядка
      { productId: insertedProducts[1].id, categoryId: categoryMap['Зарядные устройства'], createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[1].id, categoryId: categoryMap['Зарядные устройства Iphone'], createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[1].id, categoryId: categoryMap['Все товары'], createdAt: new Date(), updatedAt: new Date() },

      // Наушники
      { productId: insertedProducts[2].id, categoryId: categoryMap['Наушники беспроводные'], createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[2].id, categoryId: categoryMap['Все товары'], createdAt: new Date(), updatedAt: new Date() },

      // Power Bank
      { productId: insertedProducts[3].id, categoryId: categoryMap['Портативная зарядка(Power Bank)'], createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[3].id, categoryId: categoryMap['Все товары'], createdAt: new Date(), updatedAt: new Date() },

      // Стекло
      { productId: insertedProducts[4].id, categoryId: categoryMap['Защитные стекла'], createdAt: new Date(), updatedAt: new Date() },
      { productId: insertedProducts[4].id, categoryId:  categoryMap['Все товары'], createdAt: new Date(), updatedAt: new Date() },
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