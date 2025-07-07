import { generateToken } from "../config/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"
import cloudinary from "../config/cloudinary.js";

//sign up new user
export const signup = async(req,res)=>{
    const {fullName,email,password,bio} = req.body;
    try {
        if (!fullName,!email,!password,!bio) {
            return res.json({success:false,message:"Missing Details"})
        }
        const user = await User.findOne({email});
        if (user) {
          return res.json({success:false,message:"Account Already Exist"})   
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = User.create({
            fullName,email,password:hashedPassword,bio
        })
        const token = generateToken(newUser._id)
        res.json({success:true,userData:newUser,token,
            message:"Account Created Successfully"
        })
    } catch (error) {
        console.log(error.message);
       res.json({success:false,message:error.message})  
    }
}

//controller function to login user 
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await User.findOne({ email });

    // ✅ Check if user exists first
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(userData._id);

    res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//controller to check if user is authenticated

export const checkAuth =(req,res)=>{
    res.json({success:true,user:req.user});
}

//controller to updata user profile details

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic,bio,fullName} = req.body;
        const userId = req.user._id;
        let updateUser;
        if (!profilePic) {
           updateProfile = await User.findByIdAndUpdate(userId,{bio,fullName},
                {new:true});
        }else{
            const upload = await cloudinary.uploader.upload(profilePic)
            updateUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true})
        }
        res.json({success:true,user:updateUser})
    } catch (error) {
      console.log(error.message);
      res.json({success:true,message:error.message})  
    }
}
