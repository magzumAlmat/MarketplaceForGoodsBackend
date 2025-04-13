module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Создаём категории
    const categoryNames = [
      'Купание',
      'Уход',
      'Защита',
      'Средства для мамы',
      'Органическая линейка',
      'Другое',
    ];

    const existingCategories = await queryInterface.sequelize.query(
      `SELECT id, name FROM categories WHERE name IN (:names)`,
      {
        replacements: { names: categoryNames },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    const categoryMap = {};
    existingCategories.forEach((cat) => {
      categoryMap[cat.name] = cat.id;
    });

    const categoriesToInsert = categoryNames
      .filter((name) => !categoryMap[name])
      .map((name) => ({
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    if (categoriesToInsert.length > 0) {
      await queryInterface.bulkInsert('categories', categoriesToInsert, {});
    }

    // Обновляем categoryMap
    const allCategories = await queryInterface.sequelize.query(
      `SELECT id, name FROM categories WHERE name IN (:names)`,
      {
        replacements: { names: categoryNames },
        type: queryInterface.sequelize.QueryTypes.SELECT,
      }
    );

    allCategories.forEach((cat) => {
      categoryMap[cat.name] = cat.id;
    });

    // Очищаем таблицы
    await queryInterface.bulkDelete('product_categories', null, {});
    await queryInterface.bulkDelete('product_images', null, {});
    await queryInterface.bulkDelete('products', null, {});

    // Создаём товары
    const products = [
      {
        title: 'Гель для тела и волос 2 в 1',
        description: 'Бережно очищает и защищает хрупкую кожу ребенка, делая её эластичной, мягкой и защищённой.',
        price: 10.99,
        categoryId: categoryMap['Купание'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Основа моющая для лица и тела',
        description: 'Безопасно очищает лицо и тело малыша, обеспечивая мягкость и комфорт.',
        price: 12.99,
        categoryId: categoryMap['Купание'],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Добавь остальные продукты аналогично
    ];

    await queryInterface.bulkInsert('products', products, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_categories', null, {});
    await queryInterface.bulkDelete('product_images', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};