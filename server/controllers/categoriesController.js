const {Category} = require('../models');

class CategoriesController {

    async getCategories(req, res) {
        try {
            const categories = await Category.findAll(); // Получение всех категорий из БД //name of the model
            console.log(categories);
            res.status(200).json(categories); // Отправка категорий на клиент
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
            res.status(500).json({message: 'Ошибка сервера'});
        }
    }

    async create(req, res) { //new category
        const {name} = req.body;
        if (!name) {
            return res.status(400).json({message: 'Название категории обязательно'});  // Если имя не передано
        }
        try {
            const newCategory = await Category.create({ name });
            /*res.status(201).json({ message: 'Категория создана', category: newCategory });*/ //return only one
            const categories = await Category.findAll();
            res.status(201).json({ message: 'Категория создана', categories }); //return all of them

        } catch (e) {
            console.error('Ошибка при создании категории:', e);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }


    async delete(req, res) {
        const { id } = req.params; // Извлекаем id из параметров запроса /url
        try{
            const category = await Category.findByPk(id); //search method sequelize

            if (!category) {
                return res.status(404).json({ message: 'Категория не найдена' });
            }

            await category.destroy();
            const categories = await Category.findAll();
            res.status(201).json({ message: 'Категория была удалена', categories }); //return all of them

        }catch(e){
            console.error('Ошибка при удалении категории:', e);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async like(req, res) { //not realized

    }
}

module.exports = new CategoriesController()