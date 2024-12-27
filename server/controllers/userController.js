const ApiError = require('../error/ApiError');
const uuid = require('uuid')
const path = require('path');
const {User} = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role}, //in the central part users data is encrypted
        process.env.SECRET_KEY, //random key
        {expiresIn: '24h'} //how soon WILL DIE NOT YOU BUT TOKEN :)
    )
}


class UserController {


    //http://localhost:4000/api/user/register

    async registration(req, res, next) {
        const {email, password, userName, description, role} = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest('некорректный емайл или пароль'))
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            return next(ApiError.badRequest('пользователь с таким емайл уже есть'))
        }
        const hashedPassword = await bcrypt.hash(password, 5);  //hashing of password //num of hashing times
        const newUser = await User.create({
            email,
            password: hashedPassword,
            userName,
            description,
            avatar: null,
            role,
        });

        const token = generateJwt(newUser.id, newUser.email, newUser.role)
        return res.json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                userName: newUser.userName,
                description: newUser.description,
                avatar: newUser.avatar,
            },
        });
    }


    //При входе пользователь отправляет email и пароль. Если они совпадают, сервер возвращает токен.
    //http://localhost:4000/api/user/login
    async login(req, res, next) {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});
        if (!user) {
            return next(ApiError.internal('пользователь с таким именем не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!comparePassword) {
            return next(ApiError.internal('пароль не верен'))
        }
        //creation of token
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                userName: user.userName,
                description: user.description,
                avatar: user.avatar,
            },
        });


    }

    //http://localhost:4000/api/user/auth
    //пользователь постоянно использует свой аккаунт а значит токен перезаписывается
    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({token});

    }


    //http://localhost:4000/api/user/users/:id
    async getOne(req, res, next) {
        const userId = parseInt(req.params.id, 10);
        const user = await User.findOne({where: {id: userId}});
        if (!user) {
            return next(ApiError.badRequest('пользователь не найден'))
        }
        /*return res.json({user});*/
        return res.json({
            id: user.id,
            avatar: user.avatar,
            description: user.description,
            userName: user.userName,
            subscriptions: user.subscriptions,
            subscribers: user.subscribers,
            receivedLikes: user.receivedLikes,
            placedLikes: user.placedLikes,
            role: user.role,
        });

    }

    //http://localhost:4000/api/user/users
    async getAll(req, res,next) {
        try {
            // Получаем всех пользователей, только нужные поля
            const users = await User.findAll({
                attributes: ['id', 'email', 'userName', 'description', 'avatar', 'subscriptions', 'subscribers', 'receivedLikes', 'placedLikes','role'],
            });
            // Преобразуем экземпляры моделей Sequelize в чистые объекты
            //возвращаемые объекты не будут экземплярами моделей Sequelize.
            //не включают Служебную информацию (например, временные метки, флаги для отслеживания изменений).	Методы, доступные только в контексте Sequelize, такие как save(), reload(), set(), и другие. и тд
            const userList = users.map(user => user.toJSON());
            // Отправляем список пользователей
            return res.status(200).json(userList);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }


    }

    //http://localhost:4000/api/user/update
    //PUT /api/user/update
    // Authorization: Bearer <your-token>
    // Content-Type: multipart/form-data
    // {
    //   "email": "newemail@example.com",
    //   "password": "newpassword123",
    //   "userName": "newUserName",
    //   "description": "Updated description",
    //   "avatar": <file>  # Автоматически передается файл аватара
    // }
    async update(req, res) {
        const { email, password, userName, description } = req.body;
        const userId = req.user.id;

        try{
            // Ищем пользователя в базе данных по userId
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            // Проверка на уникальность email
            if (email) {
                const existingUser = await User.findOne({ where: { email, id: { [Op.ne]: userId } } }); //оператором “не равно” (Not Equal)
                if (existingUser) {
                    return res.status(400).json({ message: 'Email уже занят' });
                }
                user.email = email;  // Обновляем email
            }

            // Хэширование пароля, если он был изменен
            if (password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);  // Хэшируем новый пароль
            }
            if (userName) {
                user.userName = userName;  // Обновляем имя пользователя
            }

            if (description) {
                user.description = description;  // Обновляем описание
            }

            // Если файл (аватар) был загружен, обрабатываем его
            if (req.files && req.files.avatar) {
                const { avatar } = req.files;
                const fileName = uuid.v4() + ".jpg";  // Генерация уникального имени для файла
                // Перемещаем файл в нужную папку
                await avatar.mv(path.resolve(__dirname, '..', 'static', fileName));
                user.avatar = `/static/${fileName}`;  // Обновляем аватар
            }

            await user.save();
            return res.json({ message: 'Данные пользователя успешно обновлены', user });

        }catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Ошибка при обновлении данных пользователя' });
        }
    }



    //http://localhost:4000/api/user/delete
    async delete(req, res,next) {
        /*const { userId } = req.user; // Извлекаем ID пользователя из JWT токена //чтоб только у авторизованного получилось*/
        const { email: tokenEmail } = req.user;  // Извлекаем email из токена //чтоб только у авторизованного получилось
        const { email, password} = req.body;

        try{
            /*const user = await User.findByPk(userId); // Ищем пользователя в базе данных по ID
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Проверяем, совпадает ли email и пароль
            if (user.email !== email) {
                return res.status(400).json({ message: 'Email не совпадает с текущим пользователем' });
            }*/

            // Проверяем, совпадает ли email из токена с тем, что прислан в запросе
            if (tokenEmail !== email) {
                return res.status(400).json({ message: 'Email не совпадает с текущим пользователем' });
            }
            // Ищем пользователя по email
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            // Сравниваем введенный пароль с хэшированным паролем в базе данных
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Неверный пароль' });
            }
            // Удаляем пользователя
            await user.destroy();
            return res.json({ message: `Пользователь с email ${email} был удален` });
        }catch (e) {
            next(ApiError.badRequest(e.message));
        }


    }



    //http://localhost:4000/api/user/upload-avatar/:userId
    //PUT /api/user/1/avatar
    // Content-Type: multipart/form-data
    // Authorization: Bearer <your-token>
    //
    // {
    //   "avatar": "<file>"
    // }
    async avatarUpl(req, res, next) {
        const userId = parseInt(req.params.userId);
        const {avatar} = req.files

        try {
            if (req.user.id !== userId) {
                return res.status(403).json({ message: 'Вы не можете загрузить аватар для другого пользователя' });
            }
            const user = await User.findByPk(userId); // Находим пользователя в базе данных
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            if (!avatar) {
                return res.status(400).json({ message: 'Файл не загружен' });
            }
            // Генерация уникального имени для файла
            let fileName = uuid.v4() + ".jpg";
            // Перемещение файла в нужную папку
            await avatar.mv(path.resolve(__dirname, '..', 'static', fileName));
            // Обновление пути к аватарке в базе данных
            await user.update({ avatar: fileName });
            return res.json({ message: 'Аватар успешно загружен', avatar: fileName });
        } catch (e) {
            console.error(e);
            next(ApiError.badRequest(e.message));
        }

    }


}

module.exports = new UserController()