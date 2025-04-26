import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import cloudinary from "../config/cloudinary.js";
const getAttendance=async(req,res)=>{
 
    try {
        const date = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.find({date}).populate({
            path: "employeeId",
            populate: [
                "department",
                "userId"
            ]
        });
        console.log(attendance);
        
        return res.status(200).json({success: true, attendance})
    } catch(error){
        return res.status(500).json({success: false, error: "get attendance server error"})
    }
}

const updateAttendance = async (req, res) => {
    try {
        const {employeeId} = req.params;
        const {status} = req.body
        
        const date = new Date().toISOString().split('T')[0];
        const employee = await Employee.findOne({employeeId})

        const attendance = await Attendance.findOneAndUpdate({employeeId: employee._id, date}, {status}, {new: true});
        
        if (attendance) {
            attendance.status = status;
            await attendance.save();
            res.status(200).json({ success: true, message: 'Attendance updated successfully' });

        } else {
            const newAttendance = new Attendance({
                employeeId,
                date,
                status,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            await newAttendance.save();
            res.status(200).json({ success: true, message: 'Attendance created successfully' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "update attendance server error" });
    }
}

const getAttendanceReport = async (req, res) => {
    try {
        const {date, limit = 5, skip = 0} = req.query;
        const query = {};

        if(date) {
            query.date = date;
        }

        const attendanceData = await Attendance.find(query)
        .populate({
            path: "employeeId",
            populate: [
                "department",
                "userId"
            ]
        }).sort({date: -1}).limit(parseInt(limit)).skip(parseInt(skip))

        const groupData = attendanceData.reduce((result, record) => {
            if (!record || !record.date || !record.employeeId || !record.employeeId.userId || !record.employeeId.department) {
                console.warn("Skipping invalid record:", record); // Log for debugging
                return result;
            }
            if (!result[record.date]) {
                result[record.date] = [];
            }
            result[record.date].push({
                employeeId: record.employeeId.employeeId,
                employeeName: record.employeeId.userId.name,
                departmentName: record.employeeId.department.dep_name,
                status: record.status || "Not Marked"
            });
            console.log(result);
            
            return result; // Return the accumulator for reduce
        }, {}); 
        return res.status(201).json({ success: true, groupData });
    }catch(error){
        console.log(error);
        
        res.status(500).json({success: false, error: "get attendance server error"})
        
    }
}
 
export {  getAttendance, getAttendanceReport, updateAttendance };