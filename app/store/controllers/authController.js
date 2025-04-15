const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function doLogin(req, res) {
  console.log('doLogin: started');
  
  const staticUserData = {
    id: 1,
    email: 'admin@admin.kz',
    username: 'admin',
    name: 'Admin User',
    role: 'ADMIN',
    password: '$2a$12$9PMW/PsEWRa8X29TA/O5judBbnQtnTm4kcfR7cepKISmM7Dn2Rvku', // Хэш пароля
  };

  try {
    const { email, password } = req.body;
    console.log('doLogin: input:', { email, password });
    bcrypt.hash('root', 12).then(hash => console.log(hash));
    // Проверка email
    if (email !== staticUserData.email) {
      console.log('doLogin: invalid email');
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, staticUserData.password);
    if (!isMatch) {
      console.log('doLogin: invalid password');
      return res.status(401).json({ message: 'Неверные учетные данные' });
    }

    // Генерация JWT-токена
    const token = jwt.sign(
      {
        id: staticUserData.id,
        email: staticUserData.email,
        username: staticUserData.username,
        name: staticUserData.name,
        role: staticUserData.role,
      },
      'your_jwt_secret', // Замените на ваш секретный ключ
      { expiresIn: '1h' }
    );

    console.log('doLogin: success, token generated');
    return res.status(200).json({
      token,
      user: {
        id: staticUserData.id,
        email: staticUserData.email,
        username: staticUserData.username,
        name: staticUserData.name,
        role: staticUserData.role,
      },
    });
  } catch (error) {
    console.error('doLogin: error:', error.message);
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
}

module.exports = {
  doLogin,
};