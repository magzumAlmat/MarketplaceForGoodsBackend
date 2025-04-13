const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { email, password, username, address, phone } = req.body;
    if (!email || !password || !username || !address || !phone) {
      return res.status(400).json({ message: 'Необходимы email, password, username, address и phone' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
      address,
      phone,
    });

    return res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      address: newUser.address,
      phone: newUser.phone,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при регистрации пользователя', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Необходимы email и password' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный пароль' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при входе пользователя', error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'username', 'address', 'phone'],
    });
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при получении профиля', error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Пользователь не аутентифицирован' });
    }

    const { username, address, phone } = req.body;
    if (!username || !address || !phone) {
      return res.status(400).json({ message: 'Необходимы username, address и phone' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    await user.update({
      username,
      address,
      phone,
    });

    return res.status(200).json({
      id: user.id,
      email: user.email,
      username: user.username,
      address: user.address,
      phone: user.phone,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка при обновлении профиля', error: error.message });
  }
};
