const express = require('express')
const loginData = require('../models/loginData')
const category = require('../models/category')
const agentaddpackage = require('../models/agentaddpackage')
const location= require('../models/location')
const ivcat= require('../models/iv_category')
bcrypt = require('bcryptjs');
const categoryRouter = express.Router()

categoryRouter.get('/save-iv-category',async(req,res) => {
    try{
        
        const locations={
            iv_categoryname:req.query.iv_categoryname
        }
            
        var data = await ivcat.findOne({iv_categoryname:req.query.iv_categoryname})
        if(data){
           return  res.redirect("/admin/add_iv_category") 
        }
        var locationDetails = await ivcat(locations).save()
        if (locationDetails) {
            console.log(locationDetails);
          res.redirect("/admin/add_iv_category")
            // res.status(201).json({ success: true, error: false, message: "category added", details: categoryDetails });
        }
        
          
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
    
})

categoryRouter.get('/view-iv-category', (req, res) => {

    ivcat.find()
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

categoryRouter.get('/view_user_category', (req, res) => {

    ivcat.find()
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

categoryRouter.get('/save-location',async(req,res) => {
    try{
        
        const locations={
            location:req.query.location
        }
        var data = await location.findOne({location:req.query.location})
        if(data){
           return  res.redirect("/admin/add_location")
        }
        
        var locationDetails = await location(locations).save()
        if (locationDetails) {
          res.redirect("/admin/add_location")
            // res.status(201).json({ success: true, error: false, message: "category added", details: categoryDetails });
        }
        
          
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
    
})

categoryRouter.get('/view-location', (req, res) => {

    location.find()
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


categoryRouter.get('/save-category',async(req,res) => {
    try{
        console.log(req.query.categoryname);
        const categoryname={
            categoryname:req.query.categoryname
        }
        var data = await category.findOne({categoryname:req.query.categoryname})
        if(data){
           return res.redirect("/admin/add_category")
        }  
        
        var categoryDetails = await category(categoryname).save()
        if (categoryDetails) {
            console.log(categoryDetails);
         return res.redirect("/admin/add_category")
            // res.status(201).json({ success: true, error: false, message: "category added", details: categoryDetails });
        }
        
          
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
    
    })

categoryRouter.get('/view-category', (req, res) => {

    category.find()
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

categoryRouter.post('/agent_category', async (req, res) => {
    try {
        const categoryname = req.body.categoryname

        const categoryDetails = await category.create({ categoryname })
        if (categoryDetails) {
            res.status(201).json({ success: true, error: false, message: "category added", details: categoryDetails });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

categoryRouter.get('/view_agent_category', (req, res) => {

    category.find()
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

categoryRouter.get('/delete-cat', (req, res) => {

    category.deleteMany({categoryname:undefined})
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

categoryRouter.get('/view-city-package/:cat/:city', (req, res) => {
    const category = req.params.cat
    const city = req.params.city
    agentaddpackage.aggregate([

        {
            '$lookup': {
                'from': 'category-tbs',
                'localField': 'categoryname',
                'foreignField': '_id',
                'as': 'result'
            }
        },

        {
            "$match": {
                "result.categoryname": category
            }
        },
        {
            "$match": {
                "cityname": city
            }
        },

        {
            "$unwind": "$result"
        },
        // {
        //     "$group": {
        //         '_id': "$_id",
        //         'package_name': { "$first": "$package_name" },
        //         'categoryname': { "$first": "$result.categoryname" },
        //         'categoryid': { "$first": "$result._id" },
        //         'cityname': { "$first": "$cityname" },
        //         'description': { "$first": "$description" },
        //         'distance': { "$first": "$distance" },
        //         'days': { "$first": "$days" },
        //         'weather': { "$first": "$weather" },
        //         'budget': { "$first": "$budget" },
        //         'activity': { "$first": "$activity" },
        //     }
        // }
    ])
        .then((data) => {
            res.status(200).json({
                success: true,
                error: false,
                data: data
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: "something wrong"
            })
        })

})
categoryRouter.get('/view-city/:cat', (req, res) => {
    const category = req.params.cat
    agentaddpackage.aggregate([

        {
            '$lookup': {
                'from': 'category-tbs',
                'localField': 'categoryname',
                'foreignField': '_id',
                'as': 'result'
            }
        },

        {
            "$match": {
                "result.categoryname": category
            }
        },

        {
            "$unwind": "$result"
        },
        // {
        //     "$group": {
        //         '_id': "$_id",
        //         'package_name': { "$first": "$package_name" },
        //         'categoryname': { "$first": "$result.categoryname" },
        //         'categoryid': { "$first": "$result._id" },
        //         'cityname': { "$first": "$cityname" },
        //         'description': { "$first": "$description" },
        //         'distance': { "$first": "$distance" },
        //         'days': { "$first": "$days" },
        //         'weather': { "$first": "$weather" },
        //         'budget': { "$first": "$budget" },
        //         'activity': { "$first": "$activity" },
        //     }
        // }
    ])
        .then((data) => {
            res.status(200).json({
                success: true,
                error: false,
                data: data
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: "something wrong"
            })
        })

})

categoryRouter.get('/view-packages/:city/:categoryid',async (req, res) => {
  try {
    const cityname = req.params.city
    const id = req.params.categoryid
    const data =await agentaddpackage.find({_id:id,cityname:cityname})
       if(data) {
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
        }
  } catch (error) {
    return res.status(401).json({
        success: false,
        error: true,
        message: "error"
    })
  }
})

    
        







module.exports = categoryRouter