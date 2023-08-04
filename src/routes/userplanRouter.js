const express = require('express')

const userplan = require('../models/userplan')
const userlocation = require('../models/location')
const userPackageBooking = require('../models/userPackageBookingData')

var objectId = require('mongodb').ObjectId;

//const userselect = require('../models/userselect')



const userplanRouter = express.Router()


userplanRouter.get('/view_payment/:id', (req, res) => {
    const id = req.params.id
    userplan.aggregate([

        {
            '$lookup': {
                'from': 'user-plan-booking-tbs',
                'localField': '_id',
                'foreignField': 'package_id',
                'as': 'plan'
            }
        }, {
            '$lookup': {
                'from': 'registration-tbs',
                'localField': 'login_id',
                'foreignField': 'login_id',
                'as': 'user'
            }
        },



        {
            "$unwind": "$plan"
        },
        {
            "$unwind": "$user"
        },
        {
            "$match": {
                "agent": new objectId(id)
            }
        },
        {
            "$group": {
                '_id': "$_id",
                'package_name': { "$first": "$package_name" },
                'name': { "$first": "$user.name" },
                'mode': { "$first": "$plan.mode" },
                'date': { "$first": "$plan.date" },
            }
        }
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

userplanRouter.post('/user-package-booking', async (req, res) => {

    try {

        const dateString = new Date()
        const dates = new Date(dateString);
        const date = dates.toISOString().split('T')[0];
        const { login_id, package_id, email, phone, mode } = req.body
        const oldUser = await userPackageBooking.findOne({ package_id: req.body.package_id, status: 0, login_id: login_id })
        if (oldUser) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "Package already booked!"
            });
        }
        const packagBooking = await userPackageBooking.create({ login_id, package_id, email, phone, mode, date, status: 0 })
        if (packagBooking) {
            res.status(201).json({ success: true, error: false, message: "Package Booked", details: packagBooking });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

userplanRouter.post('/update-rejected-user-plan/:id', async (req, res) => {
    const id = req.body.id
    try {
        userplan.updateOne({ _id: id }, { $set: { agent: req.body.agent_id, status: 0 } }).then((data) => {
            return res.status(200).json({
                success: true,
                error: false,
                message: "Plan request updated"
            })
        }).catch((err) => {
            return res.status(401).json({
                success: false,
                error: true,
                message: "Something went wrong"
            })
        })

    } catch (error) {

    }
}
)

userplanRouter.get('/view_single_user_plan/:login_id', (req, res) => {
    const id = req.params.login_id
    userplan.find({ login_id: id })
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

userplanRouter.get('/view-accepted-package/:id', async (req, res) => {
    try {
        const id = req.params.id;
        userplan.find({ login_id: id, status: 1 })
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
    } catch (error) {
        return res.status(200).json({
            success: true,
            error: false,
            message: "Something went wrong"
        })
    }


})

userplanRouter.get('/view-accepted-package-agent/:id', async (req, res) => {
    try {
        const id = req.params.id;
        userplan.find({ agent: id, status: 1 })
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
    } catch (error) {
        return res.status(200).json({
            success: true,
            error: false,
            message: "Something went wrong"
        })
    }


})

userplanRouter.get('/approve-user-plan/:id', async (req, res) => {
    const id = req.params.id
    try {
        userplan.updateOne({ _id: id }, { $set: { status: 1 } }).then((data) => {
            return res.status(200).json({
                success: true,
                error: false,
                message: "Plan approved"
            })
        }).catch((err) => {
            return res.status(401).json({
                success: false,
                error: true,
                message: "Something went wrong"
            })
        })

    } catch (error) {

    }
}
)

userplanRouter.get('/view-rejected-package/:id', async (req, res) => {
    try {
        const id = req.params.id;
        userplan.find({ login_id: id, status: 2 })
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
    } catch (error) {
        return res.status(200).json({
            success: true,
            error: false,
            message: "Something went wrong"
        })
    }


})

userplanRouter.get('/reject-user-plan/:id', async (req, res) => {
    const id = req.params.id
    try {
        userplan.updateOne({ _id: id }, { $set: { status: 2 } }).then((data) => {
            return res.status(200).json({
                success: true,
                error: false,
                message: "Plan rejected"
            })
        }).catch((err) => {
            return res.status(401).json({
                success: false,
                error: true,
                message: "Something went wrong"
            })
        })

    } catch (error) {

    }
}
)

userplanRouter.post('/location', async (req, res) => {
    try {
        const location = req.body.location
        const locationDetails = await userlocation.create({ location })
        if (locationDetails) {
            res.status(201).json({ success: true, error: false, message: "location added", details: locationDetails });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

userplanRouter.get('/viewlocation', (req, res) => {
    userlocation.find()
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

userplanRouter.post('/addplan', async (req, res) => {
    try {
        const { login_id, fromlocation, wherelocation, startdate, enddate, persons, budget, traveltype, activity, requirement, agent, package_name } = req.body

        const packageDetails = await userplan.create({ login_id, fromlocation, wherelocation, startdate, enddate, persons, budget, traveltype, activity, requirement, agent, package_name, status: 0 })
        if (packageDetails) {
            res.status(201).json({ success: true, error: false, message: "package added", details: packageDetails });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

userplanRouter.get('/view_user_plan', (req, res) => {

    userplan.find()
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

userplanRouter.get('/view_single-package/:id', (req, res) => {
    const id = req.params.id
    userplan.findOne({ _id: id })
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

userplanRouter.get('/view-userplan-single-agent/:id', (req, res) => {
    const id = req.params.id

    userplan.aggregate([
        {
            '$lookup': {
                'from': 'travel_agent-tbs',
                'localField': 'agent',
                'foreignField': '_id',
                'as': 'result'
            }
        },
        {
            '$lookup': {
                'from': 'registration-tbs',
                'localField': 'login_id',
                'foreignField': 'login_id',
                'as': 'user'
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$result"
        },
        {
            "$match": {
                "agent": new objectId(id)
            }
        },
        {
            "$match": {
                "status": '0'
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "name": { "$first": "$user.name" },

                "traveltype": { "$first": "$traveltype" },


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


module.exports = userplanRouter