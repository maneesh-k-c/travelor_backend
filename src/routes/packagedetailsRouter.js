const express = require('express')
const category = require('../models/category');
const city = require('../models/city');
const packagename = require('../models/packagename');
const packageDetails = require('../models/packageDetails');
const packagedetailsRouter = express.Router()

packagedetailsRouter.post('/user-packagedetails', async (req, res) => {

    try {
        const { category_id, city_id, packagename_id, packagename, budget, weatherdetails, activity, distance, description } = req.body


        const packageDesc = await packageDetails.create({ category_id, city_id, packagename_id, packagename, budget, weatherdetails, activity, distance, description })
        if (packageDesc) {
            res.status(201).json({ success: true, error: false, message: "Package details added", details: packageDesc });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

packagedetailsRouter.get('/view_user_packagedetails/:id', (req, res) => {

    packageDetails.find()
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


module.exports = packagedetailsRouter