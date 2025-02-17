import { generateToken } from "../../helpers/jwt.js";
import { generateRandomString } from "../../helpers/misc.js";
import { comparePassword, hashPassword } from "../../helpers/passwords.js";
import User from "../../models/User.js";
import UserToken from "../../models/UserToken.js";
import { changePasswordSchema, loginSchema, resetPasswordSchema, userSchema } from "../../schemas/schemas.js";
import forgetPasswordTemplate from "../../emailTemplates/forgetPasswordTemplate.js";
import sendEmail from "../../helpers/emailSending.js";
async function login(req, res) {
    try {
        const data = req.body;
        const validation = loginSchema.safeParse(data);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.message });
        }
        let existUser = await User.findOne({ email: data.email });
        if (!existUser) {
            return res.status(400).json({ error: "User not found" });
        } else {
            const isMatch = await comparePassword(data.password, existUser.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid password" });
            } else {
                let payload = {
                    id: existUser._id,
                    name: existUser.name,
                    email: existUser.email,
                    role: existUser.role,
                }
                let token = generateToken(payload);
                return res.status(200).json({ token: token, data: payload, message: "Login successful" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function changePassword(req, res) {
    try {
        const data = req.body;
        const validation = changePasswordSchema.safeParse(data);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.message });
        }
        let existUser = await User.findOne({ email: data.email });
        if (!existUser) {
            return res.status(400).json({ error: "User not found" });
        } else {
            const isMatch = await comparePassword(data.oldPassword, existUser.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid old password" });
            } else {
                let hashedPassword = await hashPassword(data.newPassword);
                existUser.password = hashedPassword;
                await existUser.save();
                return res.status(200).json({ message: "Password changed successfully" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function forgetPassword(req, res) {
    try {
        const data = req.body;
        let { email } = data;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        email = email.toLowerCase();
        let existUser = await User.findOne({ email: email });
        if (!existUser) {
            return res.status(400).json({ error: "User not found" });
        } else {
            let token = generateRandomString(8);
            let existToken = await UserToken.findOne({ userId: existUser._id });
            if (existToken) {
                await UserToken.updateOne({ _id: existToken._id }, { token: token });
            } else {
                await new UserToken({ userId: existUser._id, token: token }).save();
            }
            const emailBody = `<h1>Reset Password</h1><p>Click <a href="${process.env.NEXT_PUBLIC_CLIENT_URL}/reset-password/${token}">here</a> to reset your password</p>`;
            const template = forgetPasswordTemplate(emailBody);
            res.status(200).json({ message: "Token sent to your email" });
            await sendEmail(email, "Reset Password", template);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function resetPassword(req, res) {
    try {
        const data = req.body;
        const validation = resetPasswordSchema.safeParse(data);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.message });
        }
        let existToken = await UserToken.findOne({ token: data.token });
        if (!existToken) {
            return res.status(400).json({ error: "Invalid token" });
        } else {
            let existUser = await User.findOne({ _id: existToken.userId });
            if (!existUser) {
                return res.status(400).json({ error: "User not found" });
            } else {
                await UserToken.deleteOne({ _id: existToken._id });
                let hashedPassword = await hashPassword(data.newPassword);
                existUser.password = hashedPassword;
                await UserToken.deleteOne({ _id: existToken._id });
                await existUser.save();
                return res.status(200).json({ message: "Password reset successfully" });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateAdminProfile(req, res) {
    try {
        let data = req.body;
        let user = req.user;
        data.role = "admin";
        const validation = userSchema.safeParse(data);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.message });
        }
        let existUser = await User.findOne({ _id: user.id });
        if (!existUser) {
            return res.status(400).json({ error: "User not found" });
        } else {
            let existEmail = await User.findOne({ email: data.email, _id: { $ne: user.id } });
            if (existEmail) {
                return res.status(400).json({ error: "Email already exists" });
            }
            existUser.name = data.name;
            existUser.email = data.email;
            existUser.phone = data.phone;
            existUser.role = data.role;
            await existUser.save();
            return res.status(200).json({ message: "Profile updated successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getUser(req, res) {
    try {
        let user = req.user;
        let userExist = await User.findOne({ _id: user.id }).select("-password -__v -createdAt -updatedAt");
        if (!userExist) {
            return res.status(400).json({ error: "User not found" });
        }
        return res.status(200).json({ data: userExist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export { login, changePassword, forgetPassword, resetPassword, updateAdminProfile, getUser };