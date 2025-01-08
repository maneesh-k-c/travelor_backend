const express = require('express')
const apiRouter = express.Router()
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const placeModel = require('../models/placeModel');
cloudinary.config({
    cloud_name: 'dxbaadblm',
    api_key: '532785353972712',
    api_secret: 'Y9gGpPnl31p6kpMRcsJIDqKjrn4',
});
const storageImage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'tripProject',
    },
});
const uploadImage = multer({ storage: storageImage });


apiRouter.post('/add-place', uploadImage.array('image', 1), async (req, res) => {
    try {


        let log = {
            userLoginId: req.body.userLoginId,
            placeName: req.body.placeName,
            description: req.body.description,
            cityName: req.body.cityName,
            image: req.files ? req.files.map((file) => file.path) : null,
            activity: req.body.activity
        };

        console.log('log', log);

        const result = await placeModel(log).save();
        if (result) {


            return res.status(200).json({
                success: true,
                error: false,
                data: result,
                message: 'Place added',
            })
        } else {
            return res.status(400).json({
                success: false,
                error: true,
                message: 'Error while adding new place',
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: 'Internal server error',
        })
    }
})

apiRouter.get('/view-places', async (req, res) => {
    try {
        const turf = await placeModel.aggregate([
            {
                '$lookup': {
                    'from': 'registration-tbs',
                    'localField': 'userLoginId',
                    'foreignField': 'login_id',
                    'as': 'user'
                }
            },
            {
                '$unwind': {
                    'path': '$user'
                }
            },
            {
                '$group': {
                    '_id': '$_id',
                    'userLoginId': { '$first': '$userLoginId' },
                    'placeName': { '$first': '$placeName' },
                    'description': { '$first': '$description' },
                    'cityName': { '$first': '$cityName' },
                    'activity': { '$first': '$activity' },
                    'name': { '$first': '$user.name' },
                    'userEmail': { '$first': '$user.email' },
                    'image': { '$first': '$imageUrl' },
                }
            }
        ])
        if (turf[0]) {
            return res.status(200).json({
                success: true,
                error: false,
                data: turf,
            })
        } else {
            return res.status(400).json({
                success: false,
                error: true,
                message: 'No data found',
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: 'Internal server error',
        })
    }
})

apiRouter.get('/view-user-added-place/:userLoginId', async (req, res) => {
    try {
        const turf = await placeModel.findOne({ userLoginId: req.params.userLoginId })
        if (turf) {
            return res.status(200).json({
                success: true,
                error: false,
                data: turf,
            })
        } else {
            return res.status(400).json({
                success: false,
                error: true,
                message: 'No data found',
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: 'Internal server error',
        })
    }
})

apiRouter.get('/view-single-places/:id', async (req, res) => {
    try {
        const turf = await placeModel.findOne({ _id: req.params.id })
        if (turf) {
            return res.status(200).json({
                success: true,
                error: false,
                data: turf,
            })
        } else {
            return res.status(400).json({
                success: false,
                error: true,
                message: 'No data found',
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: 'Internal server error',
        })
    }
})

module.exports = apiRouter