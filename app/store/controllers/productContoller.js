const { Product, Category, ProductImage } = require('../models');

const getAllProducts = async (req, res) => {
  console.log('GetAllProducts started');
  try {
    const products = await Product.findAll(); // Без include
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

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, volume, description, features, price, stock, categoryIds } = req.body;
    const parsedCategoryIds = categoryIds ? JSON.parse(categoryIds) : [];
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    await product.update({
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
      await ProductImage.destroy({ where: { productId: id } });
      const images = req.files.map((file, index) => ({
        productId: product.id,
        imagePath: `/Uploads/${file.filename}`,
        isPrimary: index === 0,
      }));
      await ProductImage.bulkCreate(images);
    }
    const updatedProduct = await Product.findByPk(id, {
      include: [
        { model: Category, attributes: ['id', 'name'], as: 'Categories', through: { attributes: [] } },
        { model: ProductImage, attributes: ['id', 'imagePath', 'isPrimary'], as: 'ProductImages' },
      ],
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
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
  deleteProduct,
};