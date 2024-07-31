const Connection = require("./db/connection.js");
const express = require("express");
//const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
const messageRoutes = require("./routes/message.routes.js");
const userRoute = require("./routes/user.route.js");
const {app, server} = require("./socket/socket.js");

const PORT = process.env.PORT || 5000;

dotenv.config();


app.use(express.json());
app.use(cors({origin:"*"}));
// app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use("/users", userRoute);

server.listen(PORT, () => {
    Connection();
    console.log(`server running on the port : ${PORT}`);
})