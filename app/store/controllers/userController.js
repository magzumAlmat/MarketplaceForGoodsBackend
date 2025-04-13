const User = require('../models/User');

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