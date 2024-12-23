import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { toRaw } from 'vue';


const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


app.use(cors({ 
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id'],
}));
app.options('*', cors());
app.use(bodyParser.json());


const users = [
    { id: 1, email: 'user@example.com', password: 'password123', userName: 'agent 001', description:'se u', avatar: null, subscriptions: [1], subscribers: [2, 3, 4, 5], receivedLikes: 1, placedLikes: []  },
    { id: 2, email: 'user@example2.com', password: 'password123', userName: 'agent 002', description:'sdc', avatar: null, subscriptions: [1], subscribers: [2, 3, 4, 5], receivedLikes: 2, placedLikes: [] },
    { id: 3, email: 'user@example3.com', password: 'password123', userName: 'agent 003', description:'jhgfd', avatar: null, subscriptions: [1,2], subscribers: [1, 2], receivedLikes: 3, placedLikes: [] },
    { id: 4, email: 'user@example4.com', password: 'password123', userName: 'agent 004', description:'poop', avatar: null, subscriptions: [1,2,3], subscribers: [1, 2, 3], receivedLikes: 4, placedLikes: [] },
    { id: 5, email: 'user@example5.com', password: 'password123', userName: 'agent 005', description:'xzxz x', avatar: null, subscriptions: [1,2,3,4], subscribers: [1, 2, 3, 4], receivedLikes: 5, placedLikes: [] },
];




const posts = [
    { id: 1, userId: 1, content: 'Первый пост пользователя 1', likes: 0, savings: 0, category: 'sport',  comments: [ { id: 1, userId: 1, content: "Great post!", createdAt: "2024-11-07T10:15:30Z", username: "UserOne" }, { id: 2, userId: 2, content: "Thanks for sharing!", createdAt: "2024-11-07T11:00:00Z", username: "UserTwo"} ] },
    { id: 2, userId: 1, content: 'Второй пост пользователя 1', likes: 0, savings: 0, category: 'design', comments: [], },
    { id: 3, userId: 2, content: 'Первый пост пользователя 2', likes: 0, savings: 0, category: 'nature', comments: [], },
    { id: 4, userId: 3, content: 'Первый пост пользователя 3', likes: 0, savings: 0, category: 'chemistry', comments: [], }
];


const savedPosts = [];
const likedPosts = [];


const categories = [
{ id: 0, name: 'all' },

  { id: 1, name: 'sport' },
  { id: 2, name: 'design' },
  { id: 3, name: 'programming' },
  { id: 4, name: 'nature' },
  { id: 4, name: 'chemistry' },
  { id: 4, name: 'Technology' },
  { id: 4, name: 'Finance' },
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
        return res.json({ token, user: { id: user.id, email: user.email, userName: user.userName, description: user.description, avatar: user.avatar } });
    } else {
        return res.status(401).json({ message: 'Неверные учетные данные' });
    }
});

app.post('/api/user/register', (req, res) => {
    const { email, password, userName, description, avatar } = req.body; 
    const existingUser = users.find((u) => u.email === email);

    if (existingUser) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
    } else {
        const newUser = { id: users.length + 1, email, password, userName, description, avatar: null }; 
        users.push(newUser);

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, 'your_jwt_secret');
        return res.json({ token, user: { id: newUser.id, email: newUser.email, userName: newUser.userName, 
        description: newUser.description, avatar: newUser.avatar || null, } });
    }
});

app.post('/api/user/upload-avatar/:userId', authenticateToken, upload.single('avatar'), (req, res) => {
   const userId = parseInt(req.params.userId);
    const user = users.find((u) => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден app.post аплод аватар который' });
    }
    if (!req.file) {
        return res.status(400).json({ message: 'Файл не загружен' });
    }
    user.avatar = `http://localhost:3000/uploads/${req.file.filename}`; 
    return res.json({ message: 'Аватар успешно загружен', avatar: user.avatar });
});



app.get('/api/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);
  
    if (user) {
        return res.json({ id: user.id, email: user.email, userName: user.userName, description: user.description, avatar: user.avatar || null, });
    } else {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
});



app.get('/api/posts', (req, res) => {
    const { category } = req.query;  
if (category && category != 'all') {
        const filteredPosts = posts.filter(post => post.category === category);
        return res.json(filteredPosts);
    }
 return res.json(posts);
});



app.get('/api/user/:userId/posts', authenticateToken, (req, res) => {
    const userId = parseInt(req.params.userId);
    const userPosts = posts.filter(post => post.userId === userId);

    if (userPosts.length) {
        return res.json(userPosts);
    } else {
        return res.status(404).json({ message: 'Посты пользователя не найдены' });
    }
});

app.post('/api/posts/:id/like', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.body.userId;
    const post = posts.find(p => p.id === postId);
    
     const debugInfo = {
        request: { postId, userId },
        currentPosts: JSON.stringify(posts, null, 2),
    };
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    if (!likedPosts.some(likedPost => likedPost.userId === userId && likedPost.postId === postId)) {
        likedPosts.push({ userId, postId });
        post.likes += 1;  
    
        debugInfo.postsafterlike=posts;
        debugInfo.likedpostsafterlike=likedPosts;
    }
    res.json({ likes: post.likes, debugInfo });
});

app.delete('/api/posts/:id/unlike', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.body.userId;
    const post = posts.find(p => p.id === postId);

    const debugInfo = { 
        request: { postId, userId },
    };
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const index = likedPosts.findIndex(likedPost => likedPost.userId === userId && likedPost.postId === postId);
    debugInfo.index=index;
    if (index !== -1) {
        post.likes -= 1;
        likedPosts.splice(index, 1); 
        debugInfo.message = "Лайк удален";
         
        debugInfo.currentPosts = posts; 
    }
    console.log("Sending response:", JSON.stringify({ likes: post.likes, debugInfo }));
    res.json({ likes: post.likes, debugInfo }); 
});


app.post('/api/posts/:id/save', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.body.userId;
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    if (!savedPosts.some(savedPost => savedPost.userId === userId && savedPost.postId === postId)) {
        savedPosts.push({ userId, postId });
        post.savings += 1;  
    }
    res.json({ savings: post.savings });
});

app.delete('/api/posts/:id/unsave', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const userId = req.body.userId;
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const index = savedPosts.findIndex(savedPost => savedPost.userId === userId && savedPost.postId === postId);
    if (index !== -1) {
        post.savings -= 1;
        savedPosts.splice(index, 1);          
    }
    res.json({ savings: post.savings}); 
});

function generateUniqueCommentId() {
    return Date.now();
}


app.post('/api/posts/:id/comments', (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { userId, content } = req.body;
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const newComment = {
        id: generateUniqueCommentId(),
        userId,
        content,
        createdAt: new Date(),
    };
    post.comments = post.comments || [];
    post.comments.push(newComment);
    res.json(newComment);
});

app.delete('/api/posts/:postId/comments/:commentId', (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const commentId = parseInt(req.params.commentId, 10);
    const post = posts.find(p => p.id === postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    const commentIndex = post.comments.findIndex(comment => comment.id === commentId);
    if (commentIndex === -1) {
        return res.status(404).json({ error: 'Comment not found' });
    }
    post.comments.splice(commentIndex, 1);
    res.json({ message: 'Comment deleted', comments: post.comments });
});

app.get('/api/posts/:postId/comments', (req, res) => {
    const postId = parseInt(req.params.postId, 10);
const debugInfo = {
        request: { postId },
       
    };

    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
 res.json({ comments: post.comments || [], debugInfo });
});


app.get('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);
    if (!user) {
        console.error(`User with id ${userId} not found`);
        return res.status(404).json({ error: 'User not found' });
    }

    res.json({
        id: user.id,
        avatar: user.avatar,
        description: user.description,
        userName: user.userName,
        subscriptions: user.subscriptions,
        subscribers: user.subscribers,
        receivedLikes: user.receivedLikes,
        placedLikes: user.placedLikes,

    });
});


app.get('/api/users', authenticateToken, (req, res) => {
    const userList = users.map(({ id, email, userName, description, avatar, subscriptions, subscribers, receivedLikes, placedLikes }) => ({
        id,
        email,
        userName,
        description,
        subscriptions, 
        subscribers,
        receivedLikes,
        placedLikes,
        avatar,
    }));
    return res.json(userList);
});


app.put('/api/user/update', authenticateToken, (req, res) => {
    const { email, password, userName, description, avatar } = req.body;       
    const userId = req.user.id;
    const user = users.find((u) => u.id === userId);
    if (user) { 
        if (email) {
            const existingUser = users.find((u) => u.email === email && u.id !== userId);
            if (existingUser) {
                return res.status(400).json({ message: 'Email уже занят' });
            }
            user.email = email;  
        }
        if (password) { 
            user.password = password;  
        }
        if (userName) {
            user.userName = userName;      
        }
        if (description) {
            user.description = description;      
        }
        if (req.file) {
            user.avatar = `/uploads/${req.file.filename}`;
        }
    
        return res.json({ message: 'Данные пользователя успешно обновлены', user });
    } else {
        return res.status(404).json({ message: 'Пользователь не найден' });
    }
});

app.delete('/api/user/delete', (req, res) => {

    const { email, password, description, avatar } = req.body;
    const userIndex = users.findIndex((u) => u.email === email && u.password === password);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        return res.json({ message: `Пользователь с email ${email} был удален` });
    } else {
        return res.status(404).json({ message: 'Пользователь не найден или неверный пароль' });
    }
});



app.get('/api/categories', (req, res) => {
  try {
    res.status(200).json(categories);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});



app.post("/api/posts", (req, res) => {
  const { postContent, userId } = req.body;

   if (!postContent || !postContent.postText || !postContent.category || !userId) {
    return res.status(400).json({ message: "Content, category, and userId are required" });
  }

  const newPost = {
    id: posts.length + 1,
    userId: userId,
    content: postContent.postText,
    likes: 0,
    savings: 0,
    category: postContent.category,
    comments: [],
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});


app.delete('/api/posts/:postId', (req, res) => {
    const postId = parseInt(req.params.postId, 10);
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    posts.splice(postIndex, 1);
    res.json({ message: 'Post deleted successfully' });
});


app.get('/api/users/:id/subscriptions', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const page = parseInt(req.query.page, 10) || 1; 
    const limit = parseInt(req.query.limit, 10) || 10; 
    const startIndex = (page - 1) * limit; 
    const endIndex = startIndex + limit;
    const subscriptions = user.subscriptions.map(subId => {
        const subUser = users.find(u => u.id === subId);
        return subUser
            ? {
                  id: subUser.id,
                  userName: subUser.userName,
                  avatar: subUser.avatar,
                  description: subUser.description,
                  subscribers: subUser.subscribers,
              }
            : null;
    }).filter(Boolean);
    const paginatedSubscriptions = subscriptions.slice(startIndex, endIndex);
const hasNextPage = endIndex < subscriptions.length;
    res.json({
        subscriptions: paginatedSubscriptions,
        total: subscriptions.length,
        page,
        limit,
hasNextPage,
    });
});



app.get('/api/users/:id/subscribers', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const page = parseInt(req.query.page, 10) || 1; 
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const subscribers = user.subscribers.map(subId => {
        const subUser = users.find(u => u.id === subId);
        return subUser
            ? {
                  id: subUser.id,
                  userName: subUser.userName,
                  avatar: subUser.avatar,
                  description: subUser.description,
                  subscribers: subUser.subscribers,
              }
            : null;
    }).filter(Boolean);
    const paginatedSubscribers = subscribers.slice(startIndex, endIndex);
    const hasNextPage = endIndex < subscribers.length;
    res.json({
        subscribers: paginatedSubscribers,
        total: subscribers.length, 
        page,
        limit,
	hasNextPage
    });
});


app.get('/protected-route', authenticateToken, (req, res) => {
    return res.json({ message: 'Доступ к защищенному ресурсу' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

