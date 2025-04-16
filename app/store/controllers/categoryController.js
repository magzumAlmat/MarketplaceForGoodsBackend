
const Category = require("../models/Category");
const ProductCategory = require("../models/ProductCategory");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const existingCategory = await Category.findOne({ where: { name } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category name must be unique." });
    }

    const category = await Category.create({ name });

    res.status(201).json({
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Failed to create category." });
  }
};

// List all categories
const listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories." });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, {
      attributes: ["id", "name"],
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Failed to fetch category." });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }

    const existingCategory = await Category.findOne({
      where: { name, id: { [Op.ne]: id } },
    });
    if (existingCategory) {
      return res.status(400).json({ message: "Category name must be unique." });
    }

    category.name = name;
    await category.save();

    res.status(200).json({
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category." });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Проверка, привязана ли категория к продуктам
    const productCategories = await ProductCategory.findAll({
      where: { categoryId: id },
    });

    if (productCategories.length > 0) {
      return res.status(400).json({
        message: "Cannot delete category because it is associated with products.",
      });
    }

    await category.destroy();

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category." });
  }
};

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
