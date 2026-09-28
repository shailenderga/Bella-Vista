import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";
import messageRoutes from "./routes/messages.js";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();
app.use(cors({origin: process.env.CLIENT_URL || 'https://localhost:5173'}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors:{origin:process.env.CLIENT_URL || 'https://localhost:5173'},
});

app.use((req, res, next) =>{
    req.io = io;
    next();
});

io.on('connection', (socket) =>{
    console.log('User connected:', socket.id);
    socket.on('disconnect', ()=>{
        console.log('User disconnect:', socket.id);
    });
});

app.get('/',(req,res) =>{
    res.json({ status:'ok', message:'Chat server is running'});
});

app.use('/api/messages', messageRoutes);

app.use(( req, res) =>{
    res.status(404).json({error:'Route not found'});
});

app.use ((err, req, res, next) =>{
    console.error(err);
    res.status(500).json({error: 'Something went wrong'});
});

const PORT = process.env.PORT || 5000;

connectDB().then(() =>{
    server.listen(PORT, () =>{
        console.log('Server running on port' + PORT);
    });
}).catch((err) =>{
    console.error('Failed to connect to MongoDB', err);
});