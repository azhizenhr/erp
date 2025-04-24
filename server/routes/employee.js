import express from 'express'
import {authMiddleware} from '../middleware/authMiddleware.js';
import { upload } from '../middleware/multer.js';
import {addEmployee,getEmployees, getEmployee, updateEmployee,fetchEmployeesByDepId,getLeaveSummary,deleteEmployee} from '../controller/employeeController.js'
 
const router = express.Router()

router.get('/', authMiddleware, getEmployees)
router.post('/add', authMiddleware, upload.single('image'), addEmployee);
router.get('/:id', authMiddleware, getEmployee)
router.put('/:id', authMiddleware, updateEmployee)
router.get('/department/:id', authMiddleware, fetchEmployeesByDepId)
router.get('/leave-summary/:userId', getLeaveSummary);
router.delete('/:id', authMiddleware, deleteEmployee);

export default router 