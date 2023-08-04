const express = require('express')
const loginData = require('../models/loginData')
const city = require('../models/city')

const cityRouter = express.Router()


cityRouter.post('/user_city',async(req,res) => {
    try{

        const category_id = req.body.category_id
        const categoryname = req.body.categoryname
        const cityname = req.body.cityname
        

        const cityDetails = await city.create({category_id,categoryname,cityname})
        if(cityDetails) {
            res.status(201).json({success:true, error:false,message:"city added",details:cityDetails});
        }
    }catch(error) {
        res.status(500).json({success:false,error:true,message:"something went wrong"});
        console.log(error);
    }
})

cityRouter.get('/view_user_city/:id',(req,res) => {
    const id = req.params.id
    city.find({category_id:id})
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


// cityRouter.post('/user_ivtype',async(req,res) => {
//     try{
        
//         const category_id = req.body.category_id
//         const ivtypename = req.body.ivtypename
        

//         const ivtypeDetails = await city.create({ivtypename,category_id})
//         if(ivtypeDetails) {
//             res.status(201).json({success:true, error:false,message:"IV type added",details:ivtypeDetails});
//         }
//     }catch(error) {
//         res.status(500).json({success:false,error:true,message:"something went wrong"});
//         console.log(error);
//     }
// })

// cityRouter.get('/view_user_ivtype/:id',(req,res) => {
//     const id = req.params.id
//     city.find({category_id:id})
//     .then(function(data) {
//         if(data==0) {
//             return res.status(401).json({
//                 success: false,
//                 error: true,
//                 message:"No data found"
//             })
//         }

//         else{
//             return res.status(200).json({
//                 success:true,
//                 error:false,
//                 data:data
//             })
//         }
//     })
// })


module.exports = cityRouter