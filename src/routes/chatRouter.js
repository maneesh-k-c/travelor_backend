const express = require('express')
const loginData = require('../models/loginData')
const chat = require('../models/chat')
const mongoose = require('mongoose');
const objectId = mongoose.Types.ObjectId

const chatRouter = express.Router()


chatRouter.post('/addchat', async (req, res) => {
    try {
        const { user_id,message,agent_id} = req.body

        const packageDetails = await chat.create({ user_id,message,agent_id,status:0, reply:null})
        if (packageDetails) {
            res.status(201).json({ success: true, error: false, message: "Message sent", details: packageDetails });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

chatRouter.get('/view-agent-chat/:id', async (req, res) => {
    try {
        const id = req.params.id
        const packageDetails = await chat.aggregate([
            {
              '$lookup': {
                'from': 'registration-tbs', 
                'localField': 'user_id', 
                'foreignField': '_id', 
                'as': 'user'
              }
            }, {
              '$lookup': {
                'from': 'travel_agent-tbs', 
                'localField': 'agent_id', 
                'foreignField': '_id', 
                'as': 'agent'
              }
            },
            {
                "$unwind": "$user"
            },
            {
                "$unwind": "$agent"
            },
            {
                "$match":{
                    "agent_id":new objectId(id)
                }
            },
            {
                "$group": {
                    '_id': "$_id",
                    'message': { "$first": "$message" },
                    'reply': { "$first": "$reply" },
                    'name': { "$first": "$user.name" },
                    'status': { "$first": "$status" },
                    // 'description': { "$first": "$description" },
                    // 'distance': { "$first": "$distance" },
                    // 'days': { "$first": "$days" },
                    // 'weather': { "$first": "$weather" },
                    // 'budget': { "$first": "$budget" },
                    // 'activity': { "$first": "$activity" },
                }
            }
          ])
        if (packageDetails) {
            res.status(201).json({ success: true, error: false,  details: packageDetails });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

chatRouter.get('/view-user-chat/:user_login_id/:agent', async (req, res) => {
    try {
        const id = req.params.user_login_id
        const agent = req.params.agent
        const packageDetails = await chat.aggregate([
            {
              '$lookup': {
                'from': 'registration-tbs', 
                'localField': 'user_id', 
                'foreignField': '_id', 
                'as': 'user'
              }
            }, {
              '$lookup': {
                'from': 'travel_agent-tbs', 
                'localField': 'agent_id', 
                'foreignField': '_id', 
                'as': 'agent'
              }
            },
            {
                "$unwind": "$user"
            },
            {
                "$unwind": "$agent"
            },
            {
                "$match":{
                    "user_id":new objectId(id)
                }
            },
            {
                "$match":{
                    "agent_id":new objectId(agent)
                }
            },
            {
                "$group": {
                    '_id': "$_id",
                    'message': { "$first": "$message" },
                    'reply': { "$first": "$reply" },
                    'name': { "$first": "$user.name" },
                    'agentname': { "$first": "$agent.name" },
                  
                }
            }
          ])
        if (packageDetails) {
            res.status(201).json({ success: true, error: false, message: "sent", details: packageDetails });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

chatRouter.post('/reply-chat', async (req, res) => {
    try {
        const chat_id = req.body.chat_id
        const { reply} = req.body

        const packageDetails = await chat.updateOne({ _id:chat_id},{$set:{reply:reply,status:1}})
        if (packageDetails.modifiedCount==1) {
            res.status(201).json({ success: true, error: false, message: "Reply added" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})



module.exports = chatRouter