import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;

app.use(cors({ 
origin: 'http://localhost:8080', 
methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(bodyParser.json());

const users = [
    { id: 1, email: 'user@example.com', password: 'password123' },
];

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => { 
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret');
        return res.json({ token, user: { id: user.id, email: user.email } });
    } else {
        return res.status(401).json({ message: 'Неверные учетные данные' });
    }
});

app.post('/api/user/register', (req, res) => {
    const { email, password } = req.body;
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
    } else {
        const newUser = { id: users.length + 1, email, password };
        users.push(newUser);

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, 'your_jwt_secret');
        return res.json({ token, user: { id: newUser.id, email: newUser.email } });
    }
});



app.get('/api/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);
  
    if (user) {
        return res.json({ id: user.id, email: user.email }); // Возвращаем данные пользователя
    } else {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
});


app.put('/api/user/update', authenticateToken, (req, res) => {
    const { email, password } = req.body; 
    const userId = req.user.id;

    const user = users.find((u) => u.id === userId);
  
    if (user) {
        user.email = email; 
        if (password) { 
            user.password = password; 
        }
        return res.json({ message: 'Данные пользователя успешно обновлены', user });
    } else {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
});

app.delete('/api/user/delete', (req, res) => {
    const { email, password } = req.body;
    const userIndex = users.findIndex((u) => u.email === email && u.password === password);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        return res.json({ message: `Пользователь с email ${email} был удален` });
    } else {
        return res.status(404).json({ message: 'Пользователь не найден или неверный пароль' });
    }
});


app.get('/protected-route', authenticateToken, (req, res) => {
    return res.json({ message: 'Доступ к защищенному ресурсу' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
