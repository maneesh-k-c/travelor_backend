const express = require('express')
const category = require('../models/category');
const city = require('../models/city');
const packagename = require('../models/packagename');
const packagefeedback = require('../models/feedback');
const mongoose = require('mongoose');

const objectId = mongoose.Types.ObjectId

const packagenameRouter = express.Router()



packagenameRouter.post('/add-feedback',async(req,res) => {

    try{
   
        const data = {
            user_id: req.body.user_id,
            package_id: req.body.package_id,
            feedback: req.body.feedback
        }

        const packageName = await packagefeedback(data).save()
        if(packageName) {
            res.status(201).json({success:true, error:false,message:"Feedback added",details:packageName});
        }
    }catch(error) {
        res.status(500).json({success:false,error:true,message:"something went wrong"});
        console.log(error);
    }
})


packagenameRouter.post('/user-cityPackagename',async(req,res) => {

    try{
        const {category_id,city_id,package_name,budget} = req.body


        const packageName = await packagename.create({category_id,city_id,package_name,budget})
        if(packageName) {
            res.status(201).json({success:true, error:false,message:"Package added",details:packageName});
        }
    }catch(error) {
        res.status(500).json({success:false,error:true,message:"something went wrong"});
        console.log(error);
    }
})

packagenameRouter.get('/view-user-added-feedback/:id',(req,res) => {
    
    const id = req.params.id
    packagefeedback.aggregate([
        {
            '$lookup': {
              'from': 'packageDetails-tbs', 
              'localField': 'package_id', 
              'foreignField': '_id', 
              'as': 'package'
            }
          },
          {
            '$lookup': {
              'from': 'registration-tbs', 
              'localField': 'user_id', 
              'foreignField': '_id', 
              'as': 'user'
            }
          }, 
        {
            "$unwind": "$package"
        },
        {
            "$unwind": "$user"
        },
        {
            "$match": {
                "user_id": new objectId(id)
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "packagename": { "$first": "$package.packagename" },
                "username": { "$first": "$user.name" },
                "feedback": { "$first": "$feedback" },
                "reply": { "$first": "$reply" },
                
            }
        }
    ])
    .then(function(data) {
        if(data==0) {
            return res.status(401).json({
                success: false,
                error: true,
                message:"No data found"
            })
        }

        else{
            return res.status(200).json({
                success:true,
                error:false,
                data:data
            })
        }
    })
})


packagenameRouter.get('/view_user_cityPackagename/:id',(req,res) => {
    
    const id = req.params.id
    packagename.find({city_id:id})
    .then(function(data) {
        if(data==0) {
            return res.status(401).json({
                success: false,
                error: true,
                message:"No data found"
            })
        }

        else{
            return res.status(200).json({
                success:true,
                error:false,
                data:data
            })
        }
    })
})


module.exports = packagenameRouter