// src/seeders/seedproduct.js
const { Op } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Проверяем и создаём категории
    const categoryNames = [
      'Купание',
      'Уход',
      'Защита',
      'Средства для мамы',
      'Органическая линейка',
      'Другое',
    ];

    // Проверяем, существуют ли категории
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

    // Вставляем только отсутствующие категории
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

    // Обновляем categoryMap после вставки новых категорий
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

    // 2. Очищаем таблицы перед вставкой
    await queryInterface.bulkDelete('product_categories', null, {});
    await queryInterface.bulkDelete('product_images', null, {});
    await queryInterface.bulkDelete('products', null, {});

    // 3. Создаём товары
    const products = [
      {
        name: 'Гель для тела и волос 2 в 1',
        volume: '50/200/350/750 мл',
        description: 'Бережно очищает и защищает хрупкую кожу ребенка, делая её эластичной, мягкой и защищённой.',
        features: '97% натуральных ингредиентов, устраняет дискомфорт и стянутость.',
        price: 10.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Основа моющая для лица и тела',
        volume: '750 мл',
        description: 'Безопасно очищает лицо и тело малыша, обеспечивая мягкость и комфорт.',
        features: '96% натуральных ингредиентов, уменьшает чувство стянутости сухой или хрупкой кожи.',
        price: 12.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Шампунь для младенцев',
        volume: '200/350 мл',
        description: 'Бережно очищает волосы и кожу головы новорождённого, распутывает волосы, делает их мягкими, блестящими и легко расчёсываемыми.',
        features: '96% натуральных ингредиентов, бессульфатный.',
        price: 9.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Мыло туалетное детское',
        volume: '150 г',
        description: 'Специально разработано для ежедневного ухода за новорождённым, очищает кожу нежной пеной, легко смывается, не сушит.',
        features: '100% растительных ингредиентов в очищающей основе, кремовая текстура.',
        price: 5.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Гель-душ для тела и волос органический',
        volume: '500 мл',
        description: 'Нежно очищает и защищает хрупкую кожу ребёнка, делая её эластичной, мягкой и нежной.',
        features: '99% натуральных ингредиентов, обогащён органическим алоэ вера, сертифицирован ECOCERT.',
        price: 15.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Детское масло для ванны Расслабляющее',
        volume: '150 мл',
        description: 'Успокаивает ребёнка мягким и расслабляющим ароматом.',
        features: 'Расслабляющий эффект.',
        price: 8.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Детский шампунь для смягчения себорейных корочек',
        volume: null,
        description: 'Успокаивает, мягко удаляет молочные корочки и предупреждает их появление, подходит для чувствительной кожи головы малыша.',
        features: '97% натуральных ингредиентов, содержит овёс.',
        price: 11.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'BIOLANE TOPILANE Детское очищающее масло для купания',
        volume: '350 мл',
        description: 'Нежно и эффективно очищает сухую и очень сухую кожу, склонную к атопическому дерматиту, подходит для ежедневного использования.',
        features: '97% натуральных ингредиентов, устраняет дискомфорт и стянутость.',
        price: 14.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'BIOLANE TOPILANE Детский очищающий крем для купания',
        volume: '350 мл',
        description: 'Очищает сухую, чувствительную и склонную к атопии кожу, используется при обострении атопического дерматита, устраняет зуд.',
        features: 'Протестировано под дерматологическим и педиатрическим контролем.',
        price: 16.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Гель для тела и волос 2в1 для сухой, склонной к атопии кожи',
        volume: '350 мл',
        description: 'Гипоаллергенная формула для сухой, раздражённой кожи при атопическом дерматите.',
        features: 'Разработан специально для атопической кожи.',
        price: 13.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Питательный увлажняющий крем для лица и тела',
        volume: '100 мл',
        description: 'Обеспечивает длительное увлажнение и придаёт коже эластичность и гладкость.',
        features: '98% натуральных ингредиентов.',
        price: 12.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Органический увлажняющий крем',
        volume: '100 мл',
        description: 'Идеально подходит для питания и защиты чувствительной кожи малыша.',
        features: '99% натуральных ингредиентов, обогащён органическим алоэ вера, цветочный аромат, ECOCERT.',
        price: 14.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Миндальное масло',
        volume: '75 мл',
        description: 'Смягчает и интенсивно питает чувствительную кожу малыша, защищая её от внешних воздействий.',
        features: 'Интенсивное питание кожи.',
        price: 9.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Органический восстанавливающий и успокаивающий бальзам Cicabébé',
        volume: '40 мл',
        description: 'Восстанавливает и снимает сильную сухость и поверхностные раздражения (покраснения вокруг рта и носа, молочные корочки).',
        features: 'Органический, успокаивающий эффект, ECOCERT.',
        price: 11.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Органический гель с Арникой',
        volume: '20 мл',
        description: 'Помогает рассасыванию синяков и гематом, подходит для младенцев, детей и взрослых.',
        features: 'Органический состав, сертифицирован ECOCERT.',
        price: 7.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Крем увлажняющий для сухой, склонной к атопии кожи',
        volume: '250 мл',
        description: 'Предназначен для ухода за сухой кожей тела и лица при атопическом дерматите.',
        features: 'Разработан для атопической кожи.',
        price: 15.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Увлажняющее молочко для тела',
        volume: '350 мл',
        description: 'Поддерживает водный баланс кожи малыша с первых дней жизни.',
        features: 'Нежная текстура.',
        price: 13.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Масло детское для расслабляющего массажа',
        volume: '50 мл',
        description: 'Предназначено для расслабляющего массажа малыша, успокаивает мягким и расслабляющим ароматом.',
        features: 'Расслабляющий эффект.',
        price: 8.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Детская термальная вода',
        volume: '150 мл',
        description: 'Освежает и успокаивает нежную кожу малыша с рождения.',
        features: '100% натуральная формула с французской термальной водой, успокаивающие свойства.',
        price: 10.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'BIOLANE TOPILANE Детский липидовосстанавливающий бальзам для тела',
        volume: '350 мл',
        description: 'Успокаивает кожу, склонную к атопии, обеспечивает увлажнение на 24 часа.',
        features: '97% натуральных ингредиентов, длительное увлажнение.',
        price: 16.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'BIOLANE TOPILANE Детский смягчающий крем для лица',
        volume: '50 мл',
        description: 'Питает, успокаивает, снимает покраснение и раздражённость кожи, защищает от внешних воздействий.',
        features: 'Снижает чувство стянутости кожи.',
        price: 9.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Жидкий тальк',
        volume: '100 мл',
        description: 'Предназначен для профилактики появления опрелостей и раздражений в зоне под подгузником.',
        features: 'Профилактика раздражений.',
        price: 7.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Крем защитный для смены подгузников',
        volume: '50/100 мл',
        description: 'Защищает кожу малыша под подгузником и эффективно устраняет покраснения и раздражения.',
        features: 'Клинически протестировано под наблюдением врача.',
        price: 8.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Крем защитный заживляющий на водной основе для смены подгузников Eryderm',
        volume: '100 мл',
        description: 'Эффективно успокаивает и восстанавливает кожу ягодиц младенцев с легким и сильным раздражением.',
        features: 'Нежирная текстура, эффект через 2 дня использования.',
        price: 10.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Органический крем под подгузник',
        volume: '100 мл',
        description: 'Эффективно защищает и восстанавливает ослабленную кожу ягодиц ребёнка.',
        features: '99% натуральных ингредиентов, обогащён органическим алоэ вера и маслом сладкого миндаля, ECOCERT.',
        price: 12.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Солнцезащитный крем SPF 50',
        volume: '125 мл',
        description: 'Обеспечивает высокую степень защиты от солнца, специально разработан для нежной кожи ребёнка, безопасен для океанов.',
        features: 'Высокая защита SPF 50, экологичный состав.',
        price: 14.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Молочко после загара',
        volume: '100 мл',
        description: 'Увлажняет, успокаивает и защищает чувствительную кожу младенцев и детей после пребывания на солнце.',
        features: '98% натуральных ингредиентов.',
        price: 9.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'BIOLANE Детская присыпка',
        volume: '75 г',
        description: 'Защищает кожу в зоне под подгузником от покраснений и раздражений, успокаивает кожу, впитывает влагу.',
        features: 'Содержит порошок овса, рисовый и кукурузный крахмалы.',
        price: 6.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Бальзам защитный для сосков с ланолином',
        volume: '40 мл',
        description: 'Предназначен для подготовки груди к грудному вскармливанию и для заживления повреждений и раздражения на сосках.',
        features: 'Поддержка грудного вскармливания, заживляющий эффект.',
        price: 11.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Крем от растяжек с маслом арганы',
        volume: '200 мл',
        description: 'Помогает предотвратить появление растяжек во время беременности.',
        features: 'Профилактика растяжек, содержит масло арганы.',
        price: 13.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Успокаивающий гель для интимной гигиены',
        volume: '200 мл',
        description: 'Разработан для мягкого очищения, увлажнения и поддержания комфорта в течение всего дня.',
        features: 'Мягкое очищение, увлажнение.',
        price: 10.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Салфетки (влажная туалетная бумага)',
        volume: '54 шт',
        description: 'Деликатно очищает кожу и сохраняет натуральный баланс.',
        features: 'Мягкое очищение, поддержание баланса кожи.',
        price: 4.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Салфетки очищающие Н2О в мягкой упаковке',
        volume: '72 шт',
        description: 'Предназначены для очищения нежной кожи новорожденного малыша в зоне под подгузником.',
        features: 'Подходят для новорожденных, очищение зоны под подгузником.',
        price: 5.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Жидкость для мытья посуды',
        volume: '250 мл',
        description: 'Эффективно удаляет жир и обладает свойством дезинфекции.',
        features: 'Удаление жира, дезинфицирующий эффект.',
        price: 7.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Жидкость для стирки белья',
        volume: '750 мл',
        description: 'Экологически чистая и гипоаллергенная жидкость для стирки белья новорожденных.',
        features: 'Экологичный состав, гипоаллергенная формула.',
        price: 9.99,
        stock: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('products', products, {});

    // 4. Создаём изображения для товаров
    const productImages = products.map((product, index) => [
      {
        productId: index + 1,
        imagePath: `/public/products/product_${index + 1}_primary.png`,
        isPrimary: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: index + 1,
        imagePath: `/public/products/product_${index + 1}_secondary.png`,
        isPrimary: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]).flat();

    await queryInterface.bulkInsert('product_images', productImages, {});

    // 5. Создаём связи товаров с категориями
    const productCategories = [
      { productId: 1, categoryId: categoryMap['Купание'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, categoryId: categoryMap['Купание'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, categoryId: categoryMap['Купание'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, categoryId: categoryMap['Купание'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, categoryId: categoryMap['Купание'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, categoryId: categoryMap['Органическая линейка'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, categoryId: categoryMap['Купание'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 7, categoryId: categoryMap['Купание'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 8, categoryId: categoryMap['Купание'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 9, categoryId: categoryMap['Купание'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 10, categoryId: categoryMap['Купание'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 11, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 12, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 12, categoryId: categoryMap['Органическая линейка'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 13, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 14, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 14, categoryId: categoryMap['Органическая линейка'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 15, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 15, categoryId: categoryMap['Органическая линейка'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 16, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 17, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 18, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 19, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 20, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 21, categoryId: categoryMap['Уход'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 22, categoryId: categoryMap['Защита'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 23, categoryId: categoryMap['Защита'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 24, categoryId: categoryMap['Защита'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 25, categoryId: categoryMap['Защита'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 25, categoryId: categoryMap['Органическая линейка'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 26, categoryId: categoryMap['Защита'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 27, categoryId: categoryMap['Защита'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 28, categoryId: categoryMap['Защита'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 29, categoryId: categoryMap['Средства для мамы'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 30, categoryId: categoryMap['Средства для мамы'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 31, categoryId: categoryMap['Средства для мамы'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 32, categoryId: categoryMap['Другое'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 33, categoryId: categoryMap['Другое'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 34, categoryId: categoryMap['Другое'], createdAt: new Date(), updatedAt: new Date() },
      { productId: 35, categoryId: categoryMap['Другое'], createdAt: new Date(), updatedAt: new Date() },
    ];

    await queryInterface.bulkInsert('product_categories', productCategories, {});

    // 6. Опционально: Создаём тестовые заказы (раскомментируй, если нужно)
    /*
    const orders = [
      {
        product_ids: [[1], [2]], // Пример: заказ включает товары с ID 1 и 2
        username: 'Иван Иванов',
        address: 'Москва, ул. Ленина, д. 10',
        phone: '+79991234567',
        status: 'pending',
        totalPrice: 23.98, // 10.99 + 12.99
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_ids: [[3]], // Заказ включает товар с ID 3
        username: 'Мария Петрова',
        address: 'Санкт-Петербург, ул. Мира, д. 5',
        phone: '+79997654321',
        status: 'completed',
        totalPrice: 9.99,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Orders', orders, {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    // Очищаем таблицы в обратном порядке зависимостей
    // await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('product_categories', null, {});
    await queryInterface.bulkDelete('product_images', null, {});
    await queryInterface.bulkDelete('products', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  },
};