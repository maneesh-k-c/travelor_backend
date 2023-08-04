const mongoose = require('mongoose')


const schema = mongoose.Schema
const bookingSchema = new schema({
    
    login_id:{type:mongoose.Types.ObjectId,ref:"login-tb"},
    description:{type:String},
    type:{type:String},
    date:{type:Number},
})

const booking = mongoose.model('booking-tb',bookingSchema)
module.exports = booking