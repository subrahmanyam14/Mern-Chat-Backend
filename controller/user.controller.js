const userModel = require("../models/user.model.js");
//const UserModel = require("../models/user.model.js");

const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await userModel.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).send(filteredUsers);
    } catch (error) {
        console.log("Error occur in the GetUsersForSideBar controller...", error);
        res.status(500).send({ error: "Internal Server error..." });
    }
}

const getAllUsersForSideBar =async (req, res) => {
    try {
        const filteredUsers = await userModel.find().select("-password");
        res.status(200).send(filteredUsers);
    } catch (error) {
        console.log("Error occur in the GetUsersForSideBar controller...", error);
        res.status(500).send({ error: "Internal Server error..." });
    }
}

module.exports = {getUsersForSideBar, getAllUsersForSideBar};