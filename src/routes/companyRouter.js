const express = require('express')
const company = require('../models/company')
const companybooking = require('../models/companyBook')
const companyRouter = express.Router()
var objectId = require('mongodb').ObjectId;

companyRouter.get('/update_comapany/:company_id', async (req, res) => {
    try {
        const id = req.params.company_id
        console.log(req.query);
        const { companyname, established_year, cityname,categoryname, description, address, phone } = req.query
        const oldname = await company.updateOne({_id:id},{$set:{ companyname, established_year, cityname,categoryname, description, address, phone }})
        if(oldname.modifiedCount==1){
          return res.status(200).json({ success: true, error: false, message: "Company details updated" });
        }
        
            res.status(201).json({ success: true, error: false, message: "No changes" });
        
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

companyRouter.get('/view_single_company/:id',async (req,res) => {
    
    try {
     const id = req.params.id
     const oldname = await company.find({_id:id})
     if(oldname[0]!=undefined){
         return res.status(200).json({
             success:true,
             error:false,
             data:oldname
         })
     }else{
         return res.status(401).json({
             success: false,
             error: true,
             message:"No data found"
         })
     }
    
    } catch (error) {
     return res.status(401).json({
         success: false,
         error: true,
         message:"Something went wrong"
     })
    }
 })

companyRouter.post('/add_comapany', async (req, res) => {
    try {

        console.log(req.body);
        const { agent_id, companyname, established_year, cityname,categoryname, description, address, phone } = req.body
        const oldname = await company.findOne({companyname})
        if(oldname){
            res.status(400).json({ success: false, error: true, message: "Company already added" });
        }
        const comapnyDetails = await company.create({ agent_id, status:0, companyname, established_year, cityname,categoryname, description, address, phone })
        if (comapnyDetails) {
            res.status(201).json({ success: true, error: false, message: "company added", details: comapnyDetails });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

companyRouter.get('/view_companys/:id',async (req,res) => {
    
    try {
     const agent = req.params.id
     const oldname = await company.find({agent_id:agent})
     if(oldname[0]!=undefined){
         return res.status(200).json({
             success:true,
             error:false,
             data:oldname
         })
     }else{
         return res.status(401).json({
             success: false,
             error: true,
             message:"No data found"
         })
     }
    
    } catch (error) {
     return res.status(401).json({
         success: false,
         error: true,
         message:"Something went wrong"
     })
    }
 })

 companyRouter.get('/view_user_available_city/:categoryid',async (req,res) => {
    
    try {
     const agent = req.params.categoryid
     const oldname = await company.find({categoryname:agent})
     
     let city = []
     for(i=0;i<oldname.length;i++){
       
         city.push(oldname[i].cityname)
     }
     
     if(oldname[0]!=undefined){
         return res.status(200).json({
             success:true,
             error:false,
             data:city
         })
     }else{
         return res.status(401).json({
             success: false,
             error: true,
             message:"No data found"
         })
     }
    
    } catch (error) {
     return res.status(401).json({
         success: false,
         error: true,
         message:"Something went wrong"
     })
    }
 })

companyRouter.get('/view_company/:city',async (req,res) => {
    
   try {
    const cityname = req.params.city
    const oldname = await company.find({cityname,status:0})
    if(oldname[0]!=undefined){
        return res.status(200).json({
            success:true,
            error:false,
            data:oldname
        })
    }else{
        return res.status(401).json({
            success: false,
            error: true,
            message:"No data found"
        })
    }
   
   } catch (error) {
    return res.status(401).json({
        success: false,
        error: true,
        message:"Something went wrong"
    })
   }
})

companyRouter.get('/view_single_company/:id', (req, res) => {
    const id = req.params.id
    company.find({_id: id })
        .then(function (data) {
            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No data found"
                })
            }

            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })
})


companyRouter.post('/book_comapany', async (req, res) => {
    try {
        const data = {
            user_id:req.body.user_id,
            company_id:req.body.company_id,
            date:req.body.date,
            status:1
        }
     
        console.log(req.body);
        const oldname = await companybooking.findOne({user_id:req.body.user_id,company_id:req.body.company_id,status:1})
        if(oldname){
            res.status(400).json({ success: false, error: true, message: "Company already booked" });
        }
        const comapnybook = await companybooking(data).save()
        if (comapnybook) {
            res.status(201).json({ success: true, error: false, message: "company booked", details: comapnybook });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})


companyRouter.get('/view-iv-user-booking/:id', (req, res) => {
    const id = req.params.id

    companybooking.aggregate([
        {
            '$lookup': {
              'from': 'company-tbs', 
              'localField': 'company_id', 
              'foreignField': '_id', 
              'as': 'company'
            }
          }, {
            '$lookup': {
              'from': 'registration-tbs', 
              'localField': 'user_id', 
              'foreignField': '_id', 
              'as': 'user'
            }
          },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$company"
        },
        {
            "$match": {
                "user_id": new objectId(id)
            }
        },
        {
            "$match": {
                "status": '1'
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "company_name": { "$first": "$company.companyname" },
                "cityname": { "$first": "$company.cityname" },
                "phone": { "$first": "$company.phone" },
                "date": { "$first": "$date" },
            }
        }
    ])
        .then(function (data) {

            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No Data Found!"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })

})


companyRouter.get('/view-iv-bookings/:id', (req, res) => {
    const id = req.params.id

    companybooking.aggregate([
        {
            '$lookup': {
              'from': 'company-tbs', 
              'localField': 'company_id', 
              'foreignField': '_id', 
              'as': 'company'
            }
          }, {
            '$lookup': {
              'from': 'registration-tbs', 
              'localField': 'user_id', 
              'foreignField': '_id', 
              'as': 'user'
            }
          },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$company"
        },
        {
            "$match": {
                "user_id": new objectId(id)
            }
        },
        {
            "$match": {
                "status": '1'
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "company_name": { "$first": "$company.companyname" },
                "cityname": { "$first": "$company.cityname" },
                "phone": { "$first": "$company.phone" },
                "date": { "$first": "$date" },
            }
        }
    ])
        .then(function (data) {

            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No Data Found!"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })

})






module.exports = companyRouter