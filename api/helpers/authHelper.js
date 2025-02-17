import User from "../models/User.js";
import { hashPassword } from "./passwords.js";
async function registerAdmin() {
    try {
        let user = {
            name: "Admin",
            email: "saadaziz0014@gmail.com",
            password: "12345678",
            role: "admin",
        }
        user.email = user.email.toLowerCase();
        let findUser = await User.findOne({ email: user.email });
        if (!findUser) {
            let hashedPassword = await hashPassword(user.password);
            user.password = hashedPassword;
            let newUser = new User(user);
            await newUser.save();
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export { registerAdmin };