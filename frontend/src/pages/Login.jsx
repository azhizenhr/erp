import React, { useState } from 'react'
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState("");
    const [error,setError]=useState(null);
    const {login}=useAuth();
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try {
            const res=await axios.post("/api/auth/login",{email,password});
           if(res.data.success){
            login(res.data.user);
            localStorage.setItem("token",res.data.token);
            if(res.data.user.role==="admin"){
                navigate("/admin-dashboard")
            }else{
                navigate("/employee-dashboard");
            }
           }
        } catch (error) {
            console.log(error);
            if(error.response && error.response.data.success){
                setError(error.response.data.error);
            }else{
                setError("Server Error")
            }
        }
    }
  return (
    <div className='flex flex-col items-center h-screen justify-center bg-gradient-to-b from-[#00B4D9] from-50% to-gray-100 to-50% space-y-6'>
        <h2 className='font-sevillena text-3xl text-white '>Employee Management System</h2>
        <div className='border shadow p-6 w-80 bg-white'>
        <h2 className='text-2xl font-bold mb-4'>Login</h2>
        {error && (<p className='text-red-500'>{error}</p> )}
        <form onSubmit={handleSubmit}>
           <div className='mb-4'>
               <label htmlFor="email" className='block text-gray-700'>Email</label>
               <input type="email" placeholder='Enter email' className='w-full px-3 py-2 border'value={email} onChange={(e)=>setEmail(e.target.value)}/>
           </div>
           <div className='mb-4'>
               <label htmlFor="password" className='block text-gray-700'>Password</label>
               <input type="password" placeholder='Password' className='w-full px-3 py-2 border' value={password} onChange={(e)=>setPassword(e.target.value)} />
           </div>
           
           <div className='mt-8'>
           <button type="submit" className='w-full bg-[#00B4D9] text-white py-2'>Login</button>
           </div>
          
       </form>
        </div>
        
    </div>
  )
}

export default Login