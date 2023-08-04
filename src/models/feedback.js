const mongoose = require('mongoose')


const schema = mongoose.Schema
const packagefeedbackSchema = new schema({
    
    user_id:{type:mongoose.Types.ObjectId,ref:"registration-tb"},
    package_id:{type:mongoose.Types.ObjectId,ref:"agentaddpackage-tb"},
    feedback:{type:String},
    date:{type:String},
    reply:{type:String},
    status:{type:String},
   
})

const packagefeedback = mongoose.model('package-feedback-tb',packagefeedbackSchema)
module.exports = packagefeedback