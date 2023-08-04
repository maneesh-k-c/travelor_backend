const mongoose = require('mongoose')


const schema = mongoose.Schema
const companySchema = new schema({
    
    agent_id:{type:mongoose.Types.ObjectId,ref:"travel_agent-tb"},
    companyname:{type:String},
    established_year:{type:String},
    cityname:{type:String},
    categoryname:{type:String},
    description:{type:String},
    address:{type:String},
    phone:{type:String},
    status:{type:String},
    
})

const company = mongoose.model('company-tb',companySchema)
module.exports = company