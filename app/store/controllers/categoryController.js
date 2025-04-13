// src/controllers/categoryController.js
const { Category, Product } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Product, as: 'products', through: { attributes: [] } }],
    });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при получении категорий', error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      include: [{ model: Product, as: 'products', through: { attributes: [] } }],
    });
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при получении категории', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Необходимо указать название категории' });
    }
    const category = await Category.create({ name });
    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при создании категории', error: error.message });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    if (!name) {
      return res.status(400).json({ message: 'Необходимо указать новое название категории' });
    }
    await category.update({ name });
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при обновлении категории', error: error.message });
  }
};

exports.addProductToCategory = async (req, res) => {
  try {
    const { categoryId, productId } = req.body;
    if (!categoryId || !productId) {
      return res.status(400).json({ message: 'Необходимы categoryId и productId' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }

    await category.addProduct(product);
    return res.status(200).json({ message: 'Продукт добавлен в категорию' });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при добавлении продукта в категорию', error: error.message });
  }
};

exports.removeProductFromCategory = async (req, res) => {
  try {
    const { categoryId, productId } = req.body;
    if (!categoryId || !productId) {
      return res.status(400).json({ message: 'Необходимы categoryId и productId' });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Продукт не найден' });
    }

    await category.removeProduct(product);
    return res.status(200).json({ message: 'Продукт удалён из категории' });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при удалении продукта из категории', error: error.message });
  }
};

exports.deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    await category.destroy();
    return res.status(200).json({ message: 'Категория удалена' });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при удалении категории', error: error.message });
  }
};
