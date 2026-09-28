import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    username:{type: String, required: true, trim: true},
    text:{type: String, required: true, trim: true},
    createdAt:{type: Date, default:Date.now},
});

export const Message = mongoose.model("Message", messageSchema);
