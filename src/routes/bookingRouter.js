const express = require('express')
const loginData = require('../models/loginData')
const booking = require('../models/booking')

const bookingRouter = express.Router()


bookingRouter.post('/',async(req,res) => {
    try{
   
        var loginDetails = {
            username: req.body.username,
            password: req.body.password,
            role: 1
        }
        var result = await loginData(loginDetails).save()
        if(result) {
            var book = {
                login_id: result._id,
                date: req.body.date,
                
               
            }
            var bookingDetails = await booking(book).save()
            if(bookingDetails) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: bookingDetails,
                    
                })
            }
        }
    } catch(err) {
    }
})

module.exports = bookingRouter