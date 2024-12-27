//декодирует токен и проверяет авторизован ли чел
jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Токен не предоставлен или неверный формат' });
        }
        const token = req.headers.authorization.split(" ")[1]; //bearer shfwehfewhfeiu
        if (!token) {
    return  res.status(401).json({message: "пользователь не авторизован"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY); //checking a token
        req.user = decoded; //add to user info
        next()
    } catch (e) {
        res.status(401).json({ message: 'Неверный токен или токен истек' });
    }
}