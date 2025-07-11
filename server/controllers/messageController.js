import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../config/cloudinary.js";
import {io,userSocketMap} from "../server.js"

//get list all users except the logged in user
export const getUsersForSideBar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    // Count unseen messages from each user to the logged-in user
    const unseenMessages = {};

    await Promise.all(
      filteredUsers.map(async (user) => {
        const messages = await Message.find({
          senderId: user._id,
          receiverId: userId,
          seen: false,
        });

        if (messages.length > 0) {
          unseenMessages[user._id] = messages.length;
        }
      })
    );

    res.json({
      success: true,
      users: filteredUsers,
      unseenMessages,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get allmessages of selected user

export const getMessages = async(req,res)=>{
    try {
     const {id:selectedUserId} = req.params;
     const myId = req.user._id;

     const messages = await Message.find({
        $or:[
            {senderId:myId,receiverId:selectedUserId},
            {senderId:selectedUserId,receiverId:myId},

        ]
     })
     await Message.updateMany({senderId:selectedUserId,receiverId:myId},
        {deen:true});
        res.json({success:true,messages})
    } catch (error) {
       console.log(error.message); 
      res.json({message:true,message:error.message})  
    }
}

//api to mark message as seen using message id

export const markMessageAsSeen = async(req,res)=>{
    try {
    const {id} = req.params;
    await Message.findByIdAndUpdate(id,{seen:true})
    res.json({success:true})
    } catch (error) {
       console.log(error.message); 
      res.json({message:true,message:error.message})   
    }
}

//send message to selected user
export const sendMessage = async(req,res)=>{
    try {
      const {text,image} = req.body;
      const receiverId = req.params.id;
      const senderId = req.user._id
      
      let imageUrl;

      if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url;
      }

      const  newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image:imageUrl
      })

      //emit the new message to the receivers socket
      const receiverSocketId = userSocketMap[receiverId];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage",newMessage)
      }
      res.json({success:true,newMessage});
    } catch (error) {
    console.log(error.message); 
      res.json({message:true,message:error.message})
    }
}