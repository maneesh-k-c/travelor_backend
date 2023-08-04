const mongoose = require('mongoose')


const schema = mongoose.Schema
const userPackagebookingSchema = new schema({
    
    login_id:{type:mongoose.Types.ObjectId,ref:"login-tb"},
    package_id:{type:mongoose.Types.ObjectId,ref:"userplan-tb"},
    email:{type:String},
    date:{type:String},
    phone:{type:String},
    mode:{type:String},
    status:{type:String},
    
})

const userPackagebooking = mongoose.model('user-plan-booking-tb',userPackagebookingSchema)
module.exports = userPackagebooking