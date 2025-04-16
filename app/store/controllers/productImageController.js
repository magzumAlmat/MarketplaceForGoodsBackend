
const ProductImage = require("../models/ProductImage");
const Product = require("../models/Product");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

// Upload product images
const uploadProductImage = async (req, res) => {
  try {
    console.log("Uploaded files:", req.files, "this is req body-", req.body);

    const { productId, isPrimary } = req.body;

    // Проверка существования продукта
    const product = await Product.findByPk(productId);
    if (!product) {
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlinkSync(path.join(__dirname, "../../Uploads", file.filename));
        });
      }
      return res.status(404).json({ message: "Product not found." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    // Создаем записи для всех загруженных изображений
    const images = req.files.map((file, index) => ({
      productId,
      imagePath: `/Uploads/${file.filename}`,
      isPrimary: isPrimary === "true" && index === 0, // Только первое изображение может быть основным, если указано
      mimetype: file.mimetype,
    }));

    const createdImages = await ProductImage.bulkCreate(images);

    // Если одно из новых изображений isPrimary, сбрасываем isPrimary у старых
    if (isPrimary === "true") {
      await ProductImage.update(
        { isPrimary: false },
        { where: { productId, id: { [Op.notIn]: createdImages.map((img) => img.id) } } }
      );
    }

    const newImages = createdImages.map((img, index) => ({
      ...img.toJSON(),
      originalname: req.files[index].originalname,
    }));

    console.log("newImages=", newImages);

    res.status(201).json({
      message: "Images uploaded successfully!",
      newImages,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(path.join(__dirname, "../../Uploads", file.filename));
      });
    }
    res.status(500).json({ message: "Image upload failed." });
  }
};

// List all images for a product
const listProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const images = await ProductImage.findAll({
      where: { productId },
    });
    res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Failed to fetch images." });
  }
};

// Fetch a single product image by ID
const getProductImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await ProductImage.findByPk(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    res.status(200).json(image);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Failed to fetch image." });
  }
};

// Update product image metadata
const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { isPrimary } = req.body;

    const image = await ProductImage.findByPk(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    // Если isPrimary меняется на true, сбрасываем isPrimary у других изображений
    if (isPrimary === "true") {
      await ProductImage.update(
        { isPrimary: false },
        { where: { productId: image.productId, id: { [Op.ne]: id } } }
      );
    }

    image.isPrimary = isPrimary === "true" ? true : image.isPrimary;
    await image.save();

    res.status(200).json({
      message: "Image updated successfully.",
      image,
    });
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).json({ message: "Failed to update image." });
  }
};

// Delete a product image
const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await ProductImage.findByPk(id);

    if (!image) {
      return res.status(404).json({ message: "Image not found." });
    }

    // Удаление файла из файловой системы
    const filePath = path.join(__dirname, "../../", image.imagePath);
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Error deleting file from disk:", err);
        return res.status(500).json({ message: "Failed to delete file." });
      }

      // Удаление записи из базы данных
      await image.destroy();
      res.status(200).json({ message: "Image deleted successfully." });
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Failed to delete image." });
  }
};

module.exports = {
  uploadProductImage,
  listProductImages,
  getProductImageById,
  updateProductImage,
  deleteProductImage,
};