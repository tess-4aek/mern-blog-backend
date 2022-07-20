import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Не дійсний формат пошти').isEmail(),
    body('password', 'Пароль повинен бути довший 4 символів').isLength({ min: 5 })
];

export const registerValidation = [
    body('email', 'Не дійсний формат пошти').isEmail(),
    body('password', 'Пароль повинен бути довший 4 символів').isLength({ min: 5 }),
    body('fullName', 'Мінімальна довжина імені 3 символи').isLength({ min: 3 }),
    body('avatarUrl', 'Це не є посиланням').optional().isURL()
];

export const postCreateValidation = [
    body('title', 'Введіть заголовок статі').isLength({ min: 3 }).isString(),
    body('text', 'Введіть текст статі (мінімум 10 символів)').isLength({ min: 10 }).isString(),
    body('tags', 'Невірний формат тегів').optional().isString(),
    body('imageUrl', 'Невірне посилання на зображення').optional().isString()
];