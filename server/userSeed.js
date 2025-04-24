import User from "./models/User.js";
import bcrypt from "bcrypt";
import {connectToDataBase} from './db/db.js'
const userRegister=async()=>{
     connectToDataBase();
    try {
        const hash=await bcrypt.hash("admin",10);
    const newUser=await User.create({
        name:"admin",
        email:'admin@gmail.com',
        password:hash,
        role:"admin",
        profileImage:"/image"
    })
    await newUser.save();
    console.log("created");
    
    } catch (error) {
       console.error(error);
        
    }
    
}

userRegister();