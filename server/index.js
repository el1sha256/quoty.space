const express = require('express');
require('dotenv').config();

const sequelize = require('./db');
const models = require('./models/models');

/*const userModel = require('./models/userModel');
const postModel = require('./models/postModel');
const categoryModel = require('./models/categoryModel');
const commentModel = require('./models/commentModel');*/


const cors = require('cors');
const router = require ('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors())
app.use(express.json());
app.use('/api', router);

//последний миддлеваре на нем работа прекращается
app.use(errorHandler)


const start = async ()=>{
    try{
        await sequelize.authenticate(); //подключение к бд
        await sequelize.sync(); //сверять состяоние данных с сотяоянием бд
        app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)})
    }catch(e){
        console.log(e);
    }
}

start()

