import express from "express"
import "dotenv/config";
import cors from "cors"
import http from 'http'
import { connectDb } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messagesRoutes.js";
import {Server} from 'socket.io';
import { Socket } from "dgram";

//Create express app and Http Server

const app = express();
const server = http.createServer(app)

//Initialize socket.io server

export const io = new Server(server,{
    cors:{origin:"*"}
})

// Store online users
export const userSocketMap ={};//{userId: socketId}

//socket.io connection handler

io.on("connection",(socket)=>{
 const userId = socket.handshake.query.userId;
 console.log("User Connected",userId);

 if (userId) userSocketMap[userId]=socket.id;

 //emit online users to all connected clients
 io.emit("getOnlineUsers",Object.keys(userSocketMap));
 socket.on("disconnect",()=>{
    console.log("User Disconnected",userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
 })
})


//middleware setup
app.use(express.json({limit:"4mb"}));
app.use(cors());
app.use("api/status",(req,res)=>res.send("Server is Live"));

//routes setup
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)

//connect to db
await connectDb()

const PORT = process.env.PORT || 5070;
server.listen(PORT,()=>console.log("Server is Running on PORT: " + PORT));