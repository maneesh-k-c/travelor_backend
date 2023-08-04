const express = require('express')
const loginData = require('../models/loginData')
const agent = require('../models/agent')
var bcrypt = require('bcryptjs');
const multer = require('multer')


const agentaddpackage = require('../models/agentaddpackage');
const mongoose = require('mongoose');
const agentPackagebooking = require('../models/agentPackageBooking');
const packagefeedback = require('../models/feedback');
const objectId = mongoose.Types.ObjectId

const agentRouter = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

agentRouter.get('/view_user_feedbacks/:id', (req, res) => {
    const id = req.params.id
    packagefeedback.aggregate([

        {
            '$lookup': {
              'from': 'registration-tbs', 
              'localField': 'user_id', 
              'foreignField': '_id', 
              'as': 'user'
            }
          }, {
            '$lookup': {
              'from': 'agentaddpackage-tbs', 
              'localField': 'package_id', 
              'foreignField': '_id', 
              'as': 'package'
            }
          },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$package"
        },
        {
            "$match": {
                "user_id": new objectId(id)
            }
        },
        {
            "$group": {
                '_id': "$_id",
                'feedback_id': { "$first": "$_id" },
                'package_name': { "$first": "$package.package_name" },
                'name': { "$first": "$user.name" },
                'user_email': { "$first": "$user.email" },
                'phonenumber': { "$first": "$user.phonenumber" },
                'date': { "$first": "$date" },
                'feedback': { "$first": "$feedback" },
                'reply': { "$first": "$reply" },
                'status': { "$first": "$status" },

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

agentRouter.get('/view_user_agent_feedbacks/:id', (req, res) => {
    const id = req.params.id
    packagefeedback.aggregate([

        {
            '$lookup': {
              'from': 'registration-tbs', 
              'localField': 'user_id', 
              'foreignField': '_id', 
              'as': 'user'
            }
          }, {
            '$lookup': {
              'from': 'agentaddpackage-tbs', 
              'localField': 'package_id', 
              'foreignField': '_id', 
              'as': 'package'
            }
          },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$package"
        },
        {
            "$match": {
                "user_id": new objectId(id)
            }
        },
        {
            "$group": {
                '_id': "$_id",
                'feedback_id': { "$first": "$_id" },
                'package_name': { "$first": "$package.package_name" },
                'name': { "$first": "$user.name" },
                'user_email': { "$first": "$user.email" },
                'phonenumber': { "$first": "$user.phonenumber" },
                'date': { "$first": "$date" },
                'feedback': { "$first": "$feedback" },
                'reply': { "$first": "$reply" },
                'status': { "$first": "$status" },

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

agentRouter.post('/add-package-feedback-reply', async (req, res) => {

    try {

        const { feedback_id,reply } = req.body
        const oldUser = await packagefeedback.updateOne({ _id:feedback_id },{$set:{reply:reply}})
        if (oldUser.modifiedCount==1) {
           return res.status(200).json({ success: true, error: false, message: "Feedback reply added" });
        }
       
          return  res.status(400).json({ success: false, error: true, message: "Feedback reply not added"});
        
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

agentRouter.get('/view_agent_feedbacks/:id', (req, res) => {
    const id = req.params.id
    packagefeedback.aggregate([

        {
            '$lookup': {
              'from': 'registration-tbs', 
              'localField': 'user_id', 
              'foreignField': '_id', 
              'as': 'user'
            }
          }, {
            '$lookup': {
              'from': 'agentaddpackage-tbs', 
              'localField': 'package_id', 
              'foreignField': '_id', 
              'as': 'package'
            }
          },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$package"
        },
        {
            "$match": {
                "package.agent_id": new objectId(id)
            }
        },
        {
            "$group": {
                '_id': "$_id",
                'feedback_id': { "$first": "$_id" },
                'package_name': { "$first": "$package.package_name" },
                'name': { "$first": "$user.name" },
                'user_email': { "$first": "$user.email" },
                'phonenumber': { "$first": "$user.phonenumber" },
                'date': { "$first": "$date" },
                'feedback': { "$first": "$feedback" },
                'reply': { "$first": "$reply" },
                'status': { "$first": "$status" },

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

agentRouter.get('/view_user_package_bookings/:id', (req, res) => {
    const id = req.params.id
    agentPackagebooking.aggregate([

        {
            '$lookup': {
                'from': 'registration-tbs',
                'localField': 'login_id',
                'foreignField': 'login_id',
                'as': 'user'
            }
        }, {
            '$lookup': {
                'from': 'agentaddpackage-tbs',
                'localField': 'package_id',
                'foreignField': '_id',
                'as': 'package'
            }
        },
        {
            '$lookup': {
                'from': 'category-tbs',
                'localField': 'package.categoryname',
                'foreignField': '_id',
                'as': 'category'
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$package"
        },
        {
            "$unwind": "$category"
        },
        {
            "$match": {
                "login_id": new objectId(id)
            }
        },
        {
            "$group": {
                '_id': "$_id",
                'package_name': { "$first": "$package.package_name" },
                'package_id': { "$first": "$package_id" },
                'cityname': { "$first": "$package.cityname" },
                'categoryname': { "$first": "$category.categoryname" },
                'description': { "$first": "$package.description" },
                'budget': { "$first": "$package.budget" },
                'name': { "$first": "$user.name" },
                'date': { "$first": "$date" },

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

agentRouter.post('/add-package-feedback', async (req, res) => {

    try {

        const dateString = new Date()
        const dates = new Date(dateString);
        const date = dates.toISOString().split('T')[0];
        const data = {
            user_id:req.body.user_id,
            feedback:req.body.feedback,
            package_id:req.body.package_id,
            date:date,
            status: 0,
            reply:null
        }
        console.log("data",data);
        const oldUser = await packagefeedback.findOne({ package_id:req.body.package_id, user_id:req.body.user_id })
        if (oldUser) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "Feedback already added!"
            });
        }
        const packagFeedbacks = await packagefeedback(data).save()
        if (packagFeedbacks) {
            res.status(201).json({ success: true, error: false, message: "Feedback added", details: packagFeedbacks });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

agentRouter.get('/view_agent_booking/:id', (req, res) => {
    const id = req.params.id
    agentPackagebooking.aggregate([

        {
            '$lookup': {
                'from': 'registration-tbs',
                'localField': 'login_id',
                'foreignField': 'login_id',
                'as': 'user'
            }
        }, {
            '$lookup': {
                'from': 'agentaddpackage-tbs',
                'localField': 'package_id',
                'foreignField': '_id',
                'as': 'package'
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$package"
        },
        {
            "$match": {
                "package.agent_id": new objectId(id)
            }
        },
        {
            "$group": {
                '_id': "$_id",
                'package_name': { "$first": "$package.package_name" },
                'name': { "$first": "$user.name" },
                'date': { "$first": "$date" },

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

agentRouter.post('/agent-package-booking', async (req, res) => {

    try {

        const dateString = new Date()
        const dates = new Date(dateString);
        const date = dates.toISOString().split('T')[0];
        const { login_id, package_id, email, phone, mode } = req.body
        const oldUser = await agentPackagebooking.findOne({ package_id: req.body.package_id, status: 0, login_id: login_id })
        if (oldUser) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "Package already booked!"
            });
        }
        const packagBooking = await agentPackagebooking.create({ login_id, package_id, email, phone, mode, date, status: 0 })
        if (packagBooking) {
            res.status(201).json({ success: true, error: false, message: "Package Booked", details: packagBooking });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

// userplanRouter.get('/view_agent_payment/:id', (req, res) => {
//     const id = req.params.id
//     userplan.aggregate([

//         {
//             '$lookup': {
//               'from': 'agent-package-booking-tbs', 
//               'localField': '_id', 
//               'foreignField': 'package_id', 
//               'as': 'plan'
//             }
//           }, {
//             '$lookup': {
//               'from': 'registration-tbs', 
//               'localField': 'login_id', 
//               'foreignField': 'login_id', 
//               'as': 'user'
//             }
//           },



//         {
//             "$unwind": "$plan"
//         },
//         {
//             "$unwind": "$user"
//         },
//         {
//             "$match":{
//                 "agent":new objectId(id)
//             }
//         },
//         {
//             "$group": {
//                 '_id': "$_id",
//                 'package_name': { "$first": "$package_name" },
//                 'name': { "$first": "$user.name" },
//                 'mode': { "$first": "$plan.mode" },
//                 'date': { "$first": "$plan.date" },
//             }
//         }
//     ])
//         .then((data) => {
//             res.status(200).json({
//                 success: true,
//                 error: false,
//                 data: data
//             })
//         })
//         .catch(err => {
//             return res.status(401).json({
//                 message: "something wrong"
//             })
//         })
// })





agentRouter.post('/', async (req, res) => {
    console.log("data" + JSON.stringify(req.body))
    try {
        console.log(req.body.username);
        const oldUser = await loginData.findOne({ username: req.body.username })
        console.log(oldUser);
        if (oldUser) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "username already exist!"
            });
        }
        const hashedPass = await bcrypt.hash(req.body.password, 12);
        const oldPhone = await agent.findOne({ phonenumber: req.body.phonenumber });
        if (oldPhone) {
            return res.status(401).json({ success: false, error: true, message: "Phone number already exist" });
        }

        const oldemail = await agent.findOne({ email: req.body.email });
        if (oldemail) {
            return res.status(401).json({ success: false, error: true, message: "Email already exist" });
        }

        var loginDetails = {
            username: req.body.username,
            password: hashedPass,
            role: 1,
            status: 0
        }

        var result = await loginData(loginDetails).save()
        if (result) {
            var agt = {
                login_id: result._id,
                name: req.body.name,
                address: req.body.address,
                email: req.body.email,

                username: req.body.username,
                phonenumber: req.body.phonenumber,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword,


            }
            var agentDetails = await agent(agt).save()
            if (agentDetails) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: agentDetails,
                    message: "Registration completed"
                })
            }
        }
    } catch (err) {
        res.status(500).json({
            success: false, error: true,
            data: agentDetails,
            message: "Something went wrong"
        });
        console.log(err);
    }
})
agentRouter.get('/view_agents', (req, res) => {

    agent.find()
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

agentRouter.get('/approve/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    loginData.find({ _id: id }).then((data) => {
        console.log("ddd==>", data[0]);
        if (data[0].status === '0') {
            loginData.updateOne({ _id: id }, { $set: { status: 1 } }).then((user) => {
                console.log(user);
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "approved"
                })
            }).catch(err => {
                return res.status(401).json({
                    message: "something went wrong"
                })
            })
        } else if (data[0].status === '1') {
            loginData.updateOne({
                _id: id
            }, {
                $set: { status: 0 }
            }).then((user) => {

                console.log(user);
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "disapproved"
                })
            }).catch(err => {
                return res.status(401).json({
                    message: "something went wrong"
                })
            })

        }
    }).catch(err => {
        return res.status(401).json({
            message: "something went wrong"
        })
    })
})


agentRouter.get('/view_agent_profile/:id', (req, res) => {
    const id = req.params.id
    agent.find({ login_id: id })
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

agentRouter.post('/update_agent_profile/:id', (req, res) => {
    const { name, username, email, address, phonenumber } = req.body
    const id = req.params.id
    console.log(id);
    agent.updateOne({ _id: id }, { $set: { name, username, email, address, phonenumber } }).then((data) => {
        console.log(data);
        res.status(200).json({
            success: true,
            error: false,
            message: "Details updated"
        })
    }).catch(err => {
        return res.status(401).json({
            message: "something went wrong"
        })
    })
})


// agentRouter.post('/agent_category',async(req,res) => {
//     try{
//         const categoryname = req.body.categoryname

//         const categoryDetails = await agentaddpackage.create({categoryname})
//         if(categoryDetails) {
//             res.status(201).json({success:true, error:false,message:"category added",details:categoryDetails});
//         }
//     }catch(error) {
//         res.status(500).json({success:false,error:true,message:"something went wrong"});
//         console.log(error);
//     }
// })

// agentRouter.get('/view_agent_category',(req,res) => {

//     agentaddpackage.find()
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

agentRouter.post('/agent-AddPackage', async (req, res) => {

    try {
        const { _id, agent_id, package_name, categoryname, cityname, description, distance, days, weather, budget, activity } = req.body


        const AddPackage = await agentaddpackage.create({ _id, agent_id, package_name, categoryname, cityname, description, distance, days, weather, budget, activity })
        if (AddPackage) {
            res.status(201).json({ success: true, error: false, message: "Package added", details: AddPackage });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }
})

agentRouter.get('/view_agent_AddPackage', (req, res) => {

    const id = req.params.id
    agentaddpackage.find()
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


agentRouter.get('/view_agent_SingleAddPackage/:id', (req, res) => {
    const id = req.params.id
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
            "$unwind": "$result"
        },
        {
            "$match": {
                "_id": new objectId(id)
            }
        },
        {
            "$group": {
                '_id': "$_id",
                'package_name': { "$first": "$package_name" },
                'categoryname': { "$first": "$result.categoryname" },
                'cityname': { "$first": "$cityname" },
                'description': { "$first": "$description" },
                'distance': { "$first": "$distance" },
                'days': { "$first": "$days" },
                'weather': { "$first": "$weather" },
                'budget': { "$first": "$budget" },
                'activity': { "$first": "$activity" },
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


// agentRouter.post('/agent-Packagename',async(req,res) => {

//     try{
//         const package_name = req.body.package_name


//         const packageName = await agentpackagename.create({package_name})
//         if(packageName) {
//             res.status(201).json({success:true, error:false,message:"Package name added",details:packageName});
//         }
//     }catch(error) {
//         res.status(500).json({success:false,error:true,message:"something went wrong"});
//         console.log(error);
//     }
// })

// agentRouter.get('/view_agent_Packagename/',(req,res) => {

//     agentpackagename.find()
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




// agentRouter.post('/agent-Packagedetails',async(req,res) => {

//     try{
//         const {packagename_id,package_name,traveltype,cityname,description,distance,days,weather,budget,activity} = req.body


//         const packageName = await agentpackageDetails.create({packagename_id,package_name,traveltype,cityname,description,distance,days,weather,budget,activity})
//         if(packageName) {
//             res.status(201).json({success:true, error:false,message:"Package name added",details:packageName});
//         }
//     }catch(error) {
//         res.status(500).json({success:false,error:true,message:"something went wrong"});
//         console.log(error);
//     }
// })


// agentRouter.get('/view_agent_Packagedetails/:id',(req,res) => {
//     const id=req.params.id
//     agentpackageDetails.find({_id:id})
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



agentRouter.post('/update_agent_package/:id', (req, res) => {
    const { package_name, traveltype, cityname, description, distance, days, weather, budget, activity } = req.body
    const id = req.params.id
    console.log(id);
    agentaddpackage.updateOne({ _id: id }, { $set: { package_name, traveltype, cityname, description, distance, days, weather, budget, activity } }).then((data) => {
        console.log(data);
        res.status(200).json({
            success: true,
            error: false,
            message: "Details updated"
        })
    }).catch(err => {
        return res.status(401).json({
            message: "something went wrong"
        })
    })
})

module.exports = agentRouter




