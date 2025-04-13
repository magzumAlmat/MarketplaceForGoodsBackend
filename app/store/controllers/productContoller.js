// src/controllers/productController.js
const { ProductImage, ProductCategory, Category } = require('../models');
const Product = require('../models/Product')
const { Op } = require('sequelize');

exports.getAllProducts = async (req, res) => {
  console.log('getAllProducts started')
  try {
    const products = await Product.findAll({
      include: [
        { model: ProductImage, as: 'images' },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ],
    });
    console.log(products)
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при получении продуктов', error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ],
    });
    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при получении продукта', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, categoryId, categoryIds } = req.body;

    // console.log('req body=', { title, price, categoryId, categoryIds });

    // Валидация входных данных
    if (!title || !price || !categoryId) {
      return res.status(400).json({ message: 'Необходимы title, price и categoryId' });
    }

    // Проверяем существование categoryId
    const categoryExists = await Category.findByPk(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ message: `Категория с ID ${categoryId} не существует` });
    }

    // Создаём продукт
    const product = await Product.create({
      title,
      description,
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
    });

    console.log('product', product);

    // Обрабатываем изображения
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        productId: product.id,
        imagePath: `/Uploads/${file.filename}`,
        isPrimary: index === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await ProductImage.bulkCreate(images);
    }

    // Связываем с категориями (many-to-many)
    if (categoryIds && Array.isArray(categoryIds)) {
      const invalidCategories = [];
      for (const catId of categoryIds) {
        const catExists = await Category.findByPk(catId);
        if (!catExists) {
          invalidCategories.push(catId);
        }
      }
      if (invalidCategories.length > 0) {
        return res.status(400).json({ message: `Категории с ID ${invalidCategories.join(', ')} не существуют` });
      }

      const productCategories = categoryIds.map((catId) => ({
        productId: product.id,
        categoryId: parseInt(catId),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await ProductCategory.bulkCreate(productCategories);
    }

    // Возвращаем продукт с изображениями и категориями
    const createdProduct = await Product.findByPk(product.id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ],
    });

    return res.status(201).json(createdProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при создании продукта', error: error.message });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, volume, description, features, price, stock, categoryId, categoryIds } = req.body;

    console.log('req body=', { title, price, stock, categoryId, categoryIds });

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }

    // Обновляем данные продукта
    await product.update({
      title: title || product.title,
      volume: volume !== undefined ? volume : product.volume,
      description: description !== undefined ? description : product.description,
      features: features !== undefined ? features : product.features,
      price: price ? parseFloat(price) : product.price,
      stock: stock ? parseInt(stock) : product.stock,
      categoryId: categoryId ? parseInt(categoryId) : product.categoryId,
    });

    // Обновляем изображения
    if (req.files && req.files.length > 0) {
      await ProductImage.destroy({ where: { productId: id } });
      const images = req.files.map((file, index) => ({
        productId: id,
        imagePath: `/Uploads/${file.filename}`,
        isPrimary: index === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await ProductImage.bulkCreate(images);
    }

    // Обновляем категории
    if (categoryIds && Array.isArray(categoryIds)) {
      await ProductCategory.destroy({ where: { productId: id } });
      const productCategories = categoryIds.map((catId) => ({
        productId: id,
        categoryId: parseInt(catId),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await ProductCategory.bulkCreate(productCategories);
    }

    // Возвращаем продукт
    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images' },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ],
    });

    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при обновлении продукта', error: error.message });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }
    await product.destroy();
    return res.status(200).json({ message: 'Продукт удалён' });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при удалении продукта', error: error.message });
  }
};