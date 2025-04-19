const { Product, Category, ProductImage } = require('../models');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${file.mimetype.split('/')[1]}`);
  },
});
// const getAllProducts = async (req, res) => {
//   console.log('GetAllProducts started');
//   try {
//     const products = await Product.findAll(
//       {include: [
//       { model: Category, attributes: ['id', 'name'], as: 'Categories', through: { attributes: [] } },
//       { model: ProductImage, attributes: ['id', 'imagePath', 'isPrimary'], as: 'ProductImages' },
//     ]}); // Без include
//     console.log('Products fetched:', products.length);
//     res.status(200).json(products);
//   } catch (error) {
//     console.error('Error in getAllProducts:', error.message, error.stack);
//     res.status(500).json({ error: error.message });
//   }
// };



const getAllProducts = async (req, res) => {
  console.log('GetAllProducts started');
  try {
    const { mainType, type, category, search, minPrice, maxPrice, sortBy } = req.query;

    // Базовые условия для фильтрации
    const where = {};
    if (type) {
      where.type = type;
    }
    if (minPrice) {
      where.price = { [Op.gte]: parseFloat(minPrice) };
    }
    if (maxPrice) {
      where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
    }
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Условия для категорий
    const categoryWhere = {};
    if (mainType && mainType !== "Все товары") {
      categoryWhere.name = mainType;
    }
    if (category && category !== "Все товары") {
      categoryWhere.name = category;
    }

    // Сортировка
    const order = [];
    if (sortBy) {
      switch (sortBy) {
        case "price_asc":
          order.push(["price", "ASC"]);
          break;
        case "price_desc":
          order.push(["price", "DESC"]);
          break;
        case "name_asc":
          order.push(["name", "ASC"]);
          break;
        case "name_desc":
          order.push(["name", "DESC"]);
          break;
      }
    }

    const products = await Product.findAll({
      where,
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
          as: 'Categories',
          through: { attributes: [] },
          where: categoryWhere.name ? categoryWhere : undefined,
        },
        {
          model: ProductImage,
          attributes: ['id', 'imagePath', 'isPrimary'],
          as: 'ProductImages',
        },
      ],
      order,
    });

    console.log('Products fetched:', products.length);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error in getAllProducts:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};



const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, attributes: ['id', 'name'], as: 'Categories', through: { attributes: [] } },
        { model: ProductImage, attributes: ['id', 'imagePath', 'isPrimary'], as: 'ProductImages' },
      ],
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req, res) => {
  console.log('Create Product started')
  try {
    const { name, volume, description, features, price, stock, categoryIds } = req.body;
    const parsedCategoryIds = categoryIds ? JSON.parse(categoryIds) : []; // Handle form-data string
    const product = await Product.create({
      name,
      volume,
      description,
      features,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
    });
    if (parsedCategoryIds.length > 0) {
      await product.setCategories(parsedCategoryIds);
    }
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        productId: product.id,
        imagePath: `/Uploads/${file.filename}`,
        isPrimary: index === 0,
      }));
      await ProductImage.bulkCreate(images);
    }
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, attributes: ['id', 'name'], as: 'Categories', through: { attributes: [] } },
        { model: ProductImage, attributes: ['id', 'imagePath', 'isPrimary'], as: 'ProductImages' },
      ],
    });
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Ограничение размера файла 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Только изображения формата JPEG, JPG или PNG!'));
  },
}).array('image', 5); // 'image' — имя поля для файлов, максимум 5 файлов

// const updateProduct = async (req, res) => {
//   console.log('я внутри editProduct')
//   try {
//     const { id } = req.params;
//     const { name, volume, description, features, price, stock, categoryIds } = req.body;
//     const parsedCategoryIds = categoryIds ? JSON.parse(categoryIds) : [];
//     const product = await Product.findByPk(id);
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
//     console.log('данные которые заходят',name, volume, description, features, price, stock, categoryIds)
//     await product.update({
//       name,
//       volume,
//       description,
//       features,
//       price: parseFloat(price),
//       stock: parseInt(stock) || 0,
//     });
//     if (parsedCategoryIds.length > 0) {
//       await product.setCategories(parsedCategoryIds);
//     }
//     if (req.files && req.files.length > 0) {
//       await ProductImage.destroy({ where: { productId: id } });
//       const images = req.files.map((file, index) => ({
//         productId: product.id,
//         imagePath: `/Uploads/${file.filename}`,
//         isPrimary: index === 0,
//       }));
//       await ProductImage.bulkCreate(images);
//     }
//     const updatedProduct = await Product.findByPk(id, {
//       include: [
//         { model: Category, attributes: ['id', 'name'], as: 'Categories', through: { attributes: [] } },
//         { model: ProductImage, attributes: ['id', 'imagePath', 'isPrimary'], as: 'ProductImages' },
//       ],
//     });
//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// Контроллер updateProduct
const updateProduct = async (req, res) => {
  console.log('я внутри editProduct');
  try {
    const { id } = req.params;

    // Логируем все данные, которые пришли с фронтенда
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    // Извлекаем текстовые поля из req.body
    const name = req.body.name || undefined;
    const volume = req.body.volume || undefined;
    const description = req.body.description || undefined;
    const features = req.body.features || undefined;
    const price = req.body.price ? parseFloat(req.body.price) : undefined;
    const stock = req.body.stock ? parseInt(req.body.stock) : undefined;
    const categoryIds = req.body.categoryIds ? JSON.parse(req.body.categoryIds) : [];
    const removedImageIds = req.body.removedImageIds ? JSON.parse(req.body.removedImageIds) : [];

    // Логируем извлеченные данные
    console.log('данные которые заходят:', { name, volume, description, features, price, stock, categoryIds, removedImageIds });

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Обновляем данные продукта
    await product.update({
      name,
      volume: volume === '' ? null : volume,
      description,
      features,
      price,
      stock: stock || 0,
    });

    // Обновляем категории
    if (categoryIds.length > 0) {
      await product.setCategories(categoryIds);
    }

    // Удаляем изображения, указанные в removedImageIds
    if (removedImageIds.length > 0) {
      await ProductImage.destroy({
        where: {
          id: removedImageIds,
          productId: id,
        },
      });
    }

    // Добавляем новые изображения, если они есть
    if (req.files && req.files.length > 0) {
      // Удаляем старые изображения, если добавляются новые
      await ProductImage.destroy({ where: { productId: id } });
      const images = req.files.map((file, index) => ({
        productId: product.id,
        imagePath: `/Uploads/${file.filename}`,
        isPrimary: index === 0,
      }));
      await ProductImage.bulkCreate(images);
    }

    // Получаем обновленный продукт
    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: Category, attributes: ['id', 'name'], as: 'Categories', through: { attributes: [] } },
        { model: ProductImage, attributes: ['id', 'imagePath', 'isPrimary'], as: 'ProductImages' },
      ],
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Ошибка в updateProduct:', error);
    res.status(400).json({ error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await ProductImage.destroy({ where: { productId: id } });
    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,upload
};