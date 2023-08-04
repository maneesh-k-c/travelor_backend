const mongoose = require('mongoose')


const schema = mongoose.Schema
const agentaddpackageSchema = new schema({
        
        agent_id:{type:mongoose.Types.ObjectId,ref:"travel_agent-tb"},
        package_name:{type:String},
        categoryid:{type:mongoose.Types.ObjectId,ref:"category-tb"},
        categoryname:{type:mongoose.Types.ObjectId,ref:"category-tb"},
        cityname:{type:String},
        description:{type:String},
        distance:{type:String},
        days:{type:String},
        weather:{type:String},
        budget:{type:String},
        activity:{type:String}
        
})

const agentaddpackage = mongoose.model('agentaddpackage-tb',agentaddpackageSchema)
module.exports = agentaddpackage