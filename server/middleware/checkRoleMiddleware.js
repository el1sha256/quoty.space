//checking the role of the person
jwt = require('jsonwebtoken');


//вызываем функцию передаем роль и эта функция уже возвращает миддлваре
module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }
        try {
            const token = req.headers.authorization.split(" ")[1]; //bearer shfwehfewhfeiu
            if (!token) {
                return  res.status(401).json({message: "пользователь не авторизован"})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY); //checking a token
            if(decoded.role !== role){
                return  res.status(403).json({message: "пользователь не имеет прав"})
            }
            req.user = decoded; //add to user info
            next()
        } catch (e) {
            res.status(401).json({message: "пользователь не авторизован"})
        }
    }
}