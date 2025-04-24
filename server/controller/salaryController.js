import Salary from "../models/Salary.js";
import Employee from '../models/Employee.js'
import mongoose from "mongoose";
export const addSalary=async(req,res)=>{
    try {
        const{employeeId,basicSalary,allowances,deductions,payDate}=req.body;
        const totalSalary=parseInt(basicSalary)+parseInt(allowances)-parseInt(deductions);
        const salary=new Salary({
            employeeId,
            basicSalary,
            allowances,
            deductions,
            netSalary:totalSalary,
            payDate
        })
        await salary.save();
        return res.status(200).json({success:true})
    } catch (error) {
        return res.status(500).json({success:false,error:"salary not added"})
    }
}

export const getSalary = async (req, res) => {
    try {
        const { id, role } = req.params;
        console.log('ID:', id);
        console.log('Role:', role);

        // Validate parameters
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, error: 'Invalid ID' });
        }
        if (!['employee', 'intern', 'admin'].includes(role)) {
            return res.status(403).json({ success: false, error: 'Invalid role' });
        }

        let salary = [];

        if (['employee', 'intern'].includes(role)) {
            // Find Employee by userId (User._id)
            const employee = await Employee.findOne({ userId: id });
            console.log('Employee:', employee);

            if (!employee) {
                return res.status(404).json({
                    success: false,
                    error: `${role.charAt(0).toUpperCase() + role.slice(1)} not found`
                });
            }

            // Find salaries by Employee._id
            salary = await Salary.find({ employeeId: employee._id })
                .populate({
                    path: 'employeeId',
                    select: 'employeeId userId designation department',
                    populate: [
                        { path: 'userId', select: 'name email role' },
                        { path: 'department', select: 'name' }
                    ]
                });
            console.log('Salaries:', salary);
        } else if (role === 'admin') {
            // For admin, assume id is Employee._id
            salary = await Salary.find({ employeeId: id })
                .populate({
                    path: 'employeeId',
                    select: 'employeeId userId designation department',
                    populate: [
                        { path: 'userId', select: 'name email role' },
                        { path: 'department', select: 'name' }
                    ]
                });
            console.log('Admin salaries:', salary);

            if (!salary || salary.length === 0) {
                const employee = await Employee.findById(id);
                if (!employee) {
                    return res.status(404).json({
                        success: false,
                        error: 'Employee not found'
                    });
                }
            }
        }

        return res.status(200).json({
            success: true,
            salary
        });
    } catch (error) {
        console.error('Error fetching salary:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
};