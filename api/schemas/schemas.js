import z from "zod";

const loginSchema = z.object({
    email: z.string().email().transform(email => email.toLowerCase()),
    password: z.string(),
});

const changePasswordSchema = z.object({
    email: z.string().email().transform(email => email.toLowerCase()),
    oldPassword: z.string(),
    newPassword: z.string(),
});

const resetPasswordSchema = z.object({
    token: z.string(),
    newPassword: z.string(),
});

const userSchema = z.object({
    name: z.string(),
    email: z.string().email().transform(email => email.toLowerCase()),
    phone: z.string(),
    role: z.string(),
});

export { loginSchema, changePasswordSchema, resetPasswordSchema, userSchema };