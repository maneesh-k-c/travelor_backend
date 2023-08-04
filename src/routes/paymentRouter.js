const express = require('express')
const loginData = require('../models/loginData')
const payment = require('../models/payment')

const paymentRouter = express.Router()


paymentRouter.post('/',async(req,res) => {
   
        var loginDetails = {
            username: req.body.username,
            password: req.body.password,
            role: 1
        }
        var result = await loginData(loginDetails).save()
        if(result) {
            var pay = {
                login_id: result._id,
                type: req.body.type,
                date: req.body.date,
               amount: req.body.amount,
               status: req.body.status,
            }
            var paymentDetails = await payment(pay).save()
            if(paymentDetails) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: paymentDetails,
                    message: "payment success"
                })
            }
        }
    } 
)

module.exports = paymentRouter