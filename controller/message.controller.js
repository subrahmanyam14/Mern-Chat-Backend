const Message = require("../models/message.model.js");
const Conversation = require("../models/conversation.model.js");
const { getReceiverSocketId, io } = require("../socket/socket.js");

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({ participants: { $all: [senderId, recieverId] } });
        if (!conversation) {
            conversation = new Conversation({ participants: [senderId, recieverId] });
        }

        const newMessage = new Message({ senderId, recieverId, message });
        await newMessage.save();

        conversation.messages.push(newMessage._id);
        await conversation.save();

        // SOCKET IO FUNCTIONALITY WILL GO HERE
		const receiverSocketId = getReceiverSocketId(recieverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

        res.status(201).send(newMessage);
    } catch (error) {
        console.log("Error occurred in the sendMessage controller", error);
        res.status(500).send({ error: "Internal Server error..." });
    }
};


const getMessages = async (req, res) => {
    try {
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({ participants: { $all: [senderId, recieverId] } }).populate('messages');
        
        if (!conversation) {
            return res.status(200).send([]);
        }

        res.status(200).send({id: conversation._id, messages: conversation.messages});
    } catch (error) {
        console.log("Error occurred in the getMessages controller", error);
        res.status(500).send({ error: "Internal Server error..." });
    }
};

const deleteMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findById(id).populate("messages");

        if (!conversation) {
            return res.status(200).send({ message: "Messages empty..." });
        }

        for (const message of conversation.messages) {
            await Message.findByIdAndDelete(message._id);
        }

        conversation.messages = [];
        await conversation.save();

        let receiverId = "";
        if (senderId.toString() === conversation.participants[0].toString()) {
            receiverId = conversation.participants[1];
        } else {
            receiverId = conversation.participants[0];
        }

        const receiverSocketId = getReceiverSocketId(receiverId);
        const senderSocketId = getReceiverSocketId(senderId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageDeleted", { chatId: conversation._id });
        }

        if (senderSocketId) {
            io.to(senderSocketId).emit("messageDeleted", { chatId: conversation._id });
        }

        res.status(200).send({ message: "Messages deleted successfully" });
    } catch (error) {
        console.log("Error while deleting messages: ", error.message);
        res.status(500).send({ error: "Internal Server error..." });
    }
};





module.exports = {sendMessage, getMessages, deleteMessages};