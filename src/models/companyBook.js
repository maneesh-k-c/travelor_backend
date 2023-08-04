const mongoose = require('mongoose')


const schema = mongoose.Schema
const companybookingSchema = new schema({
    
    user_id:{type:mongoose.Types.ObjectId,ref:"login-tb"},
    company_id:{type:mongoose.Types.ObjectId,ref:"login-tb"},
    date:{type:String},
    status:{type:String},
   
})

const companybooking = mongoose.model('company-booking-tb',companybookingSchema)
module.exports = companybooking