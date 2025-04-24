import express from 'express'
import {authMiddleware} from '../middleware/authMiddleware.js'
import { changedPassword } from '../settingController.js'
 
const router = express.Router()

router.put('/change-password', authMiddleware, changedPassword)

export default router 