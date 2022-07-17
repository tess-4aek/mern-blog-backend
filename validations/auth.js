import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Не дійсний формат пошти').isEmail(),
    body('password', 'Пароль повинен бути довший 4 символів').isLength({ min: 5 }),
    body('fullName', 'Мінімальна довжина імені 3 символи').isLength({ min: 3 }),
    body('avatarUrl', 'Це не є посиланням').optional().isURL()
];