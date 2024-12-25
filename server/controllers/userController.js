const ApiError = require('../error/ApiError');
const uuid = require('uuid')
const path = require('path');
const {User} = require("../models");


class UserController {

    async registration(req, res) {

    }

    async login(req, res) {

    }

    async check(req, res, next) {
        const {id} = req.query
        if (!id) {
            return next(ApiError.badRequest('не задан АЙди'))
        }
        res.json(id);
    }

    async getOne(req, res) {

    }

    async getAll(req, res) {

    }

    async update(req, res) {

    }

    async delete(req, res) {

    }


    async avatarUpl(req, res, next) {
        const userId = parseInt(req.params.userId);
        const {avatar} = req.files

        try {
            let fileName = uuid.v4() + ".jpg" //unique IDshka
            await avatar.mv(path.resolve(__dirname, '..', 'static', fileName)) //переместить файл с заданным именем в нужную папку

            if (req.user.id !== userId) {
                return res.status(403).json({message: 'Вы не можете загрузить аватар для другого пользователя'});
            }

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({message: 'Пользователь не найден'});
            }

            if (!req.file) {
                return res.status(400).json({message: 'Файл не загружен'});
            }
            await user.update({avatar: avatar});

            return res.json({message: 'Аватар успешно загружен', avatar: avatar});


        } catch (e) {
            console.error(e);
            next(ApiError.badRequest(e.message));
        }

    }



}

module.exports = new UserController()