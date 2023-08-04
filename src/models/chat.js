const mongoose = require('mongoose')


const schema = mongoose.Schema
const chatSchema = new schema({
    user_id:{type:mongoose.Types.ObjectId,ref:"registration-tb"},
    agent_id:{type:mongoose.Types.ObjectId,ref:"travel_agent-tb"},
    message:{type:String},
    reply:{type:String},
    status:{type:String}
    
})

const chat = mongoose.model('chat-tb',chatSchema)
module.exports = chat