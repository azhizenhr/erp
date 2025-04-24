import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
   try {
     const { email, password } = req.body;
 
     // Check for missing fields
     if (!email || !password) {
       return res.status(400).json({ success: false, error: "Email and password are required" });
     }
 
     // Find user
     const user = await User.findOne({ email });
     if (!user) {
       return res.status(400).json({ success: false, error: "User not found" });
     }
 
     // Compare password
     const isMatch = await bcrypt.compare(password, user.password);
     if (!isMatch) {
       return res.status(400).json({ success: false, error: "Wrong password" });
     }
 
     // Generate token
     const token = jwt.sign(
       { _id: user._id, role: user.role }, // (You were using user._id for role)
       process.env.JWT_KEY,
       { expiresIn: "10d" }
     );
 
     return res.status(200).json({
       success: true,
       token,
       user:{_id:user._id,name:user.name,role:user.role}
     });
   } catch (error) {
     console.log(error.message);
     res.status(500).json({ success: false, error: error.message });
   }
 };
 
export const verify=async(req,res,next)=>{
   return res.status(200).json({success:true,user:req.user}) 
}