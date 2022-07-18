import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

mongoose.connect('mongodb+srv://admin:admin@cluster0.vpsqlrr.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('Database connected'))
    .catch((e) => console.log('Database have an error: ', e));

const app = express();
const PORT = process.env.PORT || 4444;

app.use(express.json());

app.post('/auth/login', async(req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'Помилка. Користувач не знайден'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(404).json({
                message: 'Помилка. Перевірте вірність введених данних!'
            })
        }

        const token = jwt.sign({
                _id: user._id
            },
            'secret123', {
                expiresIn: '30d'
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({...userData, token });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Не вдалося авторизуватись"
        });
    }
});

app.post('/auth/register', registerValidation, async(req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash
        })

        const user = await doc.save();

        const token = jwt.sign({
                _id: user._id
            },
            'secret123', {
                expiresIn: '30d'
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({...userData, token });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не вдалося зареєструвати нового користувача'
        });
    }
});

app.get('/auth/me', checkAuth, async(req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            res.status(404).json({
                message: 'Користувач не знайден'
            })
        }
        const { passwordHash, ...userData } = user._doc;

        res.json(userData);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'У доступі відмовлено'
        });
    }
});

app.listen(PORT, (e) => {
    if (e) {
        console.log(e);
    }
    console.log(`Server started on PORT: ${PORT}`);
});