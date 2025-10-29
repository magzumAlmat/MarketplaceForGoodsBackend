
'use strict';
const bcrypt = require('bcrypt');
const User = require('../app/auth/models/User');
const Role = require('../app/auth/models/Role');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // 1. Найти роль 'admin'
      const adminRole = await Role.findOne({ where: { name: 'admin' } });
      if (!adminRole) {
        throw new Error('Admin role not found. Please run the role seeder first.');
      }

      // 2. Проверить, существует ли уже пользователь-администратор
      const adminExists = await User.findOne({ where: { username: 'admin@example.com' } });

      if (!adminExists) {
        // 3. Хешировать пароль
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // 4. Создать пользователя
        await User.create({
          username: 'admin@example.com',
          password: hashedPassword,
          phone: '0000000000', // Уникальный номер-заглушка
          name: 'Admin',
          lastname: 'User',
          roleId: adminRole.id,
        });
        console.log('✅ Admin user created successfully.');
      } else {
        console.log('ℹ️ Admin user already exists. Skipping creation.');
      }
    } catch (error) {
      console.error('Error seeding admin user:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Удалить пользователя-администратора
      await User.destroy({
        where: {
          username: 'admin@example.com',
        },
      });
      console.log('✅ Admin user deleted successfully.');
    } catch (error) {
      console.error('Error deleting admin user:', error);
    }
  }
};
