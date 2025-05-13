import User from "../models/User.js"
import Employee from "../models/Employee.js"
import bcrypt from "bcrypt";
import multer, { diskStorage } from "multer";
import path from "path";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";
import cloudinary from "../config/cloudinary.js";
export const addEmployee = async (req, res) => {
    try {
        const {
            name, email, employeeId, dob, gender, maritalStatus, designation, department, password, role
        } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "user already exists" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPass,
            role,
            profileImage: req.file ? req.file.path : "", 
        });

        const savedUser = await newUser.save();

        const newEmployee = new Employee({
            userId: savedUser._id,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
        });

        await newEmployee.save();
        return res.status(200).json({ success: true, message: "employee created" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "server error in creating employee" });
    }
};

export const getEmployees=async(req,res)=>{
    try{
        const employees = await Employee.find().populate('userId',{password:0}).populate('department')
        return res.status(200).json({success: true, employees})
    }catch(error){
        return res.status(500).json({success: false, error: "get employee server error"})
    }
}

export const getEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        let employee = await Employee.findById(id)
            .populate({
                path: 'userId',
                select: 'name email profileImage role', 
            })
            .populate({
                path: 'department',
                select: 'dep_name', 
            })
            .lean();

        if (!employee) {
            employee = await Employee.findOne({ userId: id })
                .populate({
                    path: 'userId',
                    select: 'name email profileImage role',
                })
                .populate({
                    path: 'department',
                    select: 'dep_name',
                })
                .lean();
        }

        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }

        return res.status(200).json({ success: true, employee });
    } catch (error) {
        console.error('Error fetching employee:', error);
        return res.status(500).json({ success: false, error: 'Server error fetching employee' });
    }
};

export const updateEmployee=async(req,res)=>{
    try {
       const {id}=req.params;
        const{name,maritalStatus,designation,department,salary}=req.body;
        const employee=await Employee.findById({_id:id})
        if(!employee){
            return res.status(400).json({success: false, error: " no employee found"})
        }
        const user=await User.findById({_id:employee.userId})
        if(!user){
            return res.status(400).json({success: false, error: " no user found"})
        }
        const updateUser=await User.findByIdAndUpdate({_id:employee.userId},{name});
        const updateEmployee=await Employee.findByIdAndUpdate({_id:id},{
            maritalStatus,
            designation,salary,department
        })
        if(!updateUser||!updateEmployee){
            return res.status(400).json({success: false, error: "document not found "})
        }
        return res.status(200).json({success:true,message:"updated details"});
    } catch (error) {
        return res.status(500).json({success: false, error: "update employee server error"})
    }
}

export const fetchEmployeesByDepId=async(req,res)=>{
    const{id}=req.params;
    
    try{
        const employees = await Employee.find({department:id}).populate('userId',{password:0}).populate('department')
        
        return res.status(200).json({success: true, employees})
    }catch(error){
        return res.status(500).json({success: false, error: "get employee by department id server error"})
    }
}

export const getLeaveSummary = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;

        // Find employee and get leave balance for current month
        const employee = await Employee.findOne({ userId })
            .select('leaveBalances')
            .lean();

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        // Find the leave balance for the current month
        const totalLeaveBalance = employee.leaveBalances.find(balance => balance.month === currentMonth)?.balance || 0;

        // Fetch approved leaves for debugging
        const approvedLeaves = await Leave.find({
            employeeId: employee._id,
            status: "Approved"
        }).lean();
        // console.log(`Approved leaves for employee ${employee._id}:`, approvedLeaves.map(l => ({
        //     id: l._id,
        //     startDate: l.startDate,
        //     endDate: l.endDate,
        //     days: (new Date(l.endDate).setHours(0,0,0,0) - new Date(l.startDate).setHours(0,0,0,0)) <= (1000 * 60 * 60 * 24) ? 1 : Math.ceil((new Date(l.endDate) - new Date(l.startDate)) / (1000 * 60 * 60 * 24))
        // })));

        // Count approved leave requests for the employee
        const approvedLeavesCount = approvedLeaves.length;

       return  res.status(200).json({
            success: true,
            totalLeaveBalance: totalLeaveBalance,
            approvedLeavesCount: approvedLeavesCount,
            month: currentMonth
        });
    } catch (error) {
        console.error('Error fetching leave summary:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the employee and populate userId
        const employee = await Employee.findById(id).populate('userId');
        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }

        // Delete Cloudinary image if it exists
        if (employee.userId.profileImage) {
            try {
                const publicId = employee.userId.profileImage.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`EmployeeProfiles/${publicId}`);
            } catch (cloudinaryError) {
                console.error('Error deleting Cloudinary image:', cloudinaryError);
                // Continue with deletion even if Cloudinary fails
            }
        }

        // Delete all leave records associated with the employee
        await Leave.deleteMany({ employeeId: id });

        // Delete User and Employee documents
        await User.deleteOne({ _id: employee.userId._id });
        await Employee.deleteOne({ _id: id });

        return res.status(200).json({ success: true, message: 'Employee and associated leave details deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        return res.status(500).json({ success: false, error: 'Server error deleting employee' });
    }
};