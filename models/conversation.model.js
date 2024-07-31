const mongoose = require("mongoose");

const ConversationModel = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Messages",
            default: []
        }
    ]
});

module.exports = mongoose.model("Conversation", ConversationModel);