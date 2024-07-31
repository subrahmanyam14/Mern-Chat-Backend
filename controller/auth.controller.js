const bcrypt = require("bcrypt");
const UserModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

const signUp = async (req, res) => {
    try {
        let { fullName, userName, password, confirmPassword, gender } = req.body;
        if (!fullName || !userName || !password || !confirmPassword || !gender) {
            res.status(400).send({ error: "Please provide all fields..." });
        }
        if (confirmPassword !== password) {
            res.status(400).send({ error: "passwords are not matched..." });
        }
        let user = await UserModel.findOne({ userName });
        if (user) {
            res.status(400).send({ error: "UserName already exist..." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
        const newUser = new UserModel({
            fullName,
            userName,
            password: hashPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
        });
        if (newUser) {
            await newUser.save();
            const token = jwt.sign({userId: newUser._id}, process.env.SECRET_KEY, {expiresIn: "15d"});
            res.status(201).send({
                _id: newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                profilePic: newUser.profilePic,
                token: token,
            });
        }
        else {
            res.status(400).send({ error: "Invalid user data..." });
        }
    } catch (error) {
        console.log("Error occur in the SignupController: ", error.message);
        res.status(500).send({ error: "Internal server error..." });
    }
}

const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await UserModel.findOne({ userName }).select("-password");
        const isPasswordCorrect = bcrypt.compare(password, user.password || "");
        if (!user || !isPasswordCorrect) {
            res.status(400).send({ error: "Invalid UserName or password..." });
        }
        const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: "15d"});

        res.status(200).send({
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            profilePic: user.profilePic,
            token: token
        });
    } catch (error) {
        console.log("Error occur in the Login: ", error);
        res.status(500).send({
            error: "Internal server error"
        });
    }
}

// const logout = async (req, res) => {
//     try {
//         res.cookie("jwt", "", {maxAge: 0});
//         res.status(200).send({message: "Logged out successfully..."});
//     } catch (error) {
//         console.log("Error occur in the Logout: ", error);
//         res.status(500).send({
//             error: "Internal server error"
//         });
//     }
// }

module.exports = { signUp, login,};