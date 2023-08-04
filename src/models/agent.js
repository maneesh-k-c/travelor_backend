const mongoose = require('mongoose')


const schema = mongoose.Schema
const agentSchema = new schema({
    login_id: { type: mongoose.Types.ObjectId, ref: "login-tb" },
    name: { type: String },
    address: { type: String },
    username: { type: String },
    email: { type: String },
    phonenumber: { type: String },



})

const agent = mongoose.model('travel_agent-tb', agentSchema)
module.exports = agent