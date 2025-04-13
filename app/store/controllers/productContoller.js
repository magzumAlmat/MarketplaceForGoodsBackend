// src/controllers/productController.js
const { Product, Category } = require('../models');

class ProductController {
  static async getAllProducts(req, res) {
    try {
      const products = await Product.findAll({
        include: [{ model: Category, attributes: ['id', 'name'] }],
      });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProduct(req, res) {
    try {
      const { name, volume, description, features, price, stock, categoryIds } = req.body;
      const product = await Product.create({
        name,
        volume,
        description,
        features,
        price,
        stock,
      });

      if (categoryIds && categoryIds.length > 0) {
        await product.setCategories(categoryIds);
      }

      const productWithCategories = await Product.findByPk(product.id, {
        include: [{ model: Category, attributes: ['id', 'name'] }],
      });

      res.status(201).json(productWithCategories);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, volume, description, features, price, stock, categoryIds } = req.body;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await product.update({ name, volume, description, features, price, stock });

      if (categoryIds && categoryIds.length > 0) {
        await product.setCategories(categoryIds);
      }

      const updatedProduct = await Product.findByPk(id, {
        include: [{ model: Category, attributes: ['id', 'name'] }],
      });

      res.status(200).json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      await product.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProductController;