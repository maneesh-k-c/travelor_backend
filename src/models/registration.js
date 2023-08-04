const mongoose = require('mongoose')


const schema = mongoose.Schema
const registrationSchema = new schema({
        login_id:{type:mongoose.Types.ObjectId,ref:"login-tb"},
        name:{type:String},
        username:{type:String},
        email:{type:String},
        phonenumber:{type:String},
        
        
        
    })

    const registration = mongoose.model('registration-tb',registrationSchema)
    module.exports = registration