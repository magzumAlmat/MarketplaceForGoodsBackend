// seedProduct.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categoryNames = [
      'Все товары',
      'Чехлы',
      'Премиум',
      'Зарядные устройства',
      'Зарядные устройства Iphone',
      'Зарядные устройства Samsung',
      'Держатели устойства',
      'Наушники беспроводные',
      'Наушники проводные',
      'Smart-часы и аксессуары',
      'Защитные стекла',
      'Портативная зарядка(Power Bank)',
      'Гидрогелевые пленки',
      'Шатативы',
      'Фото-видео свет',
      'Чехлы для планшетов',
      'Внешник накопители',
      'Автомобильные аксессуары',
      'Петличный микрофон',
      'Переферийные устройства',
      'Сумки',
      'Другое',
    ];

    // Проверяем, какие категории уже есть
    const existingCategories = await queryInterface.select(null, 'categories', {
      attributes: ['name'],
    });
    const existingNames = existingCategories.map(cat => cat.name);

    // Формируем только те, которых ещё нет
    const categoriesToInsert = categoryNames
      .filter(name => !existingNames.includes(name))
      .map(name => ({
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    if (categoriesToInsert.length > 0) {
      await queryInterface.bulkInsert('categories', categoriesToInsert, {});
      console.log(`Добавлено ${categoriesToInsert.length} новых категорий.`);
    } else {
      console.log('Все категории уже существуют. Ничего не добавлено.');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем ВСЕ категории (осторожно!)
    await queryInterface.bulkDelete('categories', null, {});
  },
};