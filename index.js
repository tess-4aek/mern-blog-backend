import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose.connect('mongodb+srv://admin:admin@cluster0.vpsqlrr.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Database connected'))
    .catch((e) => console.log('Database have an error: ', e));

const app = express();
const PORT = process.env.PORT || 4444;

app.use(express.json());

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);


app.listen(PORT, (e) => {
    if (e) {
        console.log(e);
    }
    console.log(`Server started on PORT: ${PORT}`);
});