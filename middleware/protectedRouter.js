const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model.js");

const protectRoute = async (req, res, next) => {
    try {
        const {authorization} = req.headers;

        if (!authorization) {
            return res.status(401).send({ error: "UnAuthorized - No token provided..." });
        }
        const token = authorization.replace("Bearer ", "");

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(401).send({ error: "UnAuthorized - Invalid Token..." });
        }

        const user = await UserModel.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).send({ error: "User not found..." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error occurred in the protectRoute: ", error.message);
        res.status(500).send({ error: "Internal Server error..." });
    }
};

module.exports = protectRoute;
