const {Post} = require('../models/models'); //db
const ApiError = require('../error/ApiError');

class PostController {
    async create(req, res) {
        const { postContent, userId } = req.body;
        const post = await Post.create({postContent, userId}) //через бд

        return res.json(post)
    }

    async getAll(req, res) {

    }
    async getUsersPosts(req, res) {

    }
    async getCategoriesPosts(req, res) {

    }

    async delete(req, res) {

    }

    async like(req, res) {

    }
    async unlike(req, res) {

    }
    async save(req, res) {

    }
    async unsave(req, res) {

    }

}

module.exports = new PostController()