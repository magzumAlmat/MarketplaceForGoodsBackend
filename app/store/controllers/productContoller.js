// src/controllers/productController.js
const { Product, ProductImage, ProductCategory, Category } = require('../models');
const { Op } = require('sequelize');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: ProductImage, as: 'images' },
        { model: Category, as: 'categories', through: { attributes: [] } },
      ],
    });
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
    const { name, volume, description, features, price, stock, categoryIds } = req.body;

    // Валидация входных данных
    if (!name || !price || !stock) {
      return res.status(400).json({ message: 'Необходимы name, price и stock' });
    }

    // Создаём продукт
    const product = await Product.create({
      name,
      volume,
      description,
      features,
      price: parseFloat(price),
      stock: parseInt(stock),
    });

    // Обрабатываем изображения
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        productId: product.id,
        imagePath: `/uploads/${file.filename}`,
        isPrimary: index === 0, // Первое изображение — основное
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await ProductImage.bulkCreate(images);
    }

    // Связываем с категориями
    if (categoryIds && Array.isArray(categoryIds)) {
      const productCategories = categoryIds.map((categoryId) => ({
        productId: product.id,
        categoryId: parseInt(categoryId),
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
    const { name, volume, description, features, price, stock, categoryIds } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }

    // Обновляем данные продукта
    await product.update({
      name: name || product.name,
      volume: volume !== undefined ? volume : product.volume,
      description: description !== undefined ? description : product.description,
      features: features !== undefined ? features : product.features,
      price: price ? parseFloat(price) : product.price,
      stock: stock ? parseInt(stock) : product.stock,
    });

    // Обновляем изображения, если загружены новые
    if (req.files && req.files.length > 0) {
      // Удаляем старые изображения
      await ProductImage.destroy({ where: { productId: id } });
      // Добавляем новые
      const images = req.files.map((file, index) => ({
        productId: id,
        imagePath: `/uploads/${file.filename}`,
        isPrimary: index === 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await ProductImage.bulkCreate(images);
    }

    // Обновляем категории
    if (categoryIds && Array.isArray(categoryIds)) {
      // Удаляем старые связи
      await ProductCategory.destroy({ where: { productId: id } });
      // Добавляем новые
      const productCategories = categoryIds.map((categoryId) => ({
        productId: id,
        categoryId: parseInt(categoryId),
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await ProductCategory.bulkCreate(productCategories);
    }

    // Возвращаем обновлённый продукт
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