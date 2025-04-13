const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('authHeader=', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Токен отсутствует или неверный формат' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET || 'your_jwt_secret');
    console.log('decoded=', decoded);
    req.user = decoded; // Например, { id: 1, email: 'admin@example.com', role: 'admin' }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный или истёкший токен', error: error.message });
  }
};