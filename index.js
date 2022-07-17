import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';

mongoose.connect('mongodb+srv://admin:admin@cluster0.vpsqlrr.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('Database connected'))
    .catch((e) => console.log('Database have an error: ', e));

const app = express();
const PORT = process.env.PORT || 4444;

app.use(express.json());

app.post('/auth/register', registerValidation, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    res.json({
        succuss: true
    })
});

app.listen(PORT, (e) => {
    if (e) {
        console.log(e);
    }
    console.log(`Server started on PORT: ${PORT}`);
});