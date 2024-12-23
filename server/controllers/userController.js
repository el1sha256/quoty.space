const ApiError = require('../error/ApiError');

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

    async avatarUpl(req, res) {

    }


}

module.exports = new UserController()