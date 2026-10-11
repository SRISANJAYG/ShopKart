import express from 'express'

import {getMe, registerUser,loginUser,logoutUser ,changepassword} from '../controllers/customer.controller.js'

import { isAuthenticated } from '../middlewares/auth.middleware.js'

const customerRoutes=express.Router()

customerRoutes.post('/register',registerUser)
customerRoutes.post('/login',loginUser)
customerRoutes.get('/me' , isAuthenticated ,getMe )
customerRoutes.post('/logout',logoutUser)
customerRoutes.patch('/change-password',isAuthenticated,changepassword)

export default customerRoutes