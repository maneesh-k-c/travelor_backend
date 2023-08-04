const express = require('express')
const loginData = require('../models/loginData')
const registration = require('../models/registration')
const agent = require('../models/agent')

const loginRouter = express.Router()
var bcrypt = require('bcryptjs')

loginRouter.post('/',async(req,res) => {
    const { username, password } = req.body;
    console.log("username",username);
    try{
        //console.log(req.body.username);
        const oldUser = await loginData.findOne({username})
       console.log(oldUser);
        if(!oldUser) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "User doesn't exist"
            })
            
        }
const passCheck = await bcrypt.compare(password,oldUser.password)
console.log("user", passCheck);
        if(!passCheck) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Incorrect password"
            })
        }
          if(oldUser.role==='1') {
            if(oldUser.status=="1") {
                const agentDetails=await agent.findOne({login_id: oldUser._id})
                console.log(agentDetails)
                if(agentDetails) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    username: oldUser.username,
                    role:oldUser.role,
                    status:oldUser.status, 
                    login_id: oldUser._id,
                    agt_id: agentDetails._id,
                    message: "Login successfull"
                     
                })
            }
        }
        else{
            return res.status(200).json({
                success: false,
                error: true,
                
                login_id:oldUser._id,
                message: "waiting for admins approval"
            })
        
        }
        
     } 

        else if(oldUser.role ==='2') {
            if(oldUser.status == "1") {
                const registerDetails = await registration.findOne({ login_id:oldUser._id})
                console.log('registerDetails',registerDetails);
                if(registerDetails) {
                    res.status(200).json({
                        success: true,
                        error: false,
                        username: oldUser.username,
                        role:oldUser.role,
                        status:oldUser.status, 
                        login_id: oldUser._id,
                        // name: registerDetails.name,
                        user_id:registerDetails._id,
                        message: "Login successful"
                    })
                }
            }

            else{
                return res.status(200).json({
                    success: false,
                    error: true,
                    
                    login_id:oldUser._id,
                    message: "waiting for admins approval"
                })
            
            }
            
         } 
     
         } catch(error) {
             res.status(500).json({
                
                message:"Something went wrong"})
        }
    })
    module.exports = loginRouter
        