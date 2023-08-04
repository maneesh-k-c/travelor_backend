const mongoose = require('mongoose')


const schema = mongoose.Schema
const paymentSchema = new schema({
    
    login_id:{type:mongoose.Types.ObjectId,ref:"login-tb"},
    type:{type:String},
    date:{type:Number},
    amount:{type:Number},
    status:{type:String},
    
})

const payment = mongoose.model('payment-tb',paymentSchema)
module.exports = payment