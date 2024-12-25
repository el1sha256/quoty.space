const express = require('express');
require('dotenv').config();

const sequelize = require('./db');
const models = require('./models/models');


const cors = require('cors');
const router = require ('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 4000;

const fileUpload = require('express-fileupload');
const path = require("path");

const app = express();
app.use(cors())
app.use(express.json());

app.use(express.static(path.resolve(__dirname, 'static'))); //статик файлы (картинки) норм открывались когда их имя вставляешь в браузер

app.use(fileUpload({}));
app.use('/api', router);


//последний миддлеваре на нем работа прекращается
app.use(errorHandler)

// Главный маршрут
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

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

