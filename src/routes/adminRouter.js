const express = require('express')
const loginData = require('../models/loginData')
const registration = require('../models/registration')
const category = require('../models/category')
const location = require('../models/location')
const company = require('../models/company')
const userpackage = require('../models/userPackageBookingData')
const packageDetails = require('../models/packageDetails');
const agentaddpackage = require('../models/agentaddpackage');
const ivcat = require('../models/iv_category');
const packagefeedback = require('../models/feedback');
const adminRouter = express.Router()

adminRouter.get('/view_user_feedback', (req, res) => {
    
    packagefeedback.aggregate([
        {
            '$lookup': {
              'from': 'agentaddpackage-tbs', 
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
            "$group": {
                "_id": "$_id",
                "packagename": { "$first": "$package.package_name" },
                "username": { "$first": "$user.name" },
                "feedback": { "$first": "$feedback" },
                "reply": { "$first": "$reply" },
                
            }
        }
    ])
    .then(function(data) {
        console.log(data);
        if(data[0]) {
            return res.render("view_user_feedback",{data})
        }

        else{
            return res.status(401).json({
                success: false,
                error: true,
                message:"No data found"
            })
          
        }
    })
})

adminRouter.get('/admin-view-user-added-feedback',(req,res) => {
    
  

})

adminRouter.get('/view-locations', async (req, res) => {
    try {
        location.find().then((data) => {
            res.status(200).json({
                success: true,
                error: false,
                data: data
            })
        })

    } catch (error) {

    }
}
)

adminRouter.get('/view-iv-category-list', async (req, res) => {
    try {
        ivcat.find().then((data) => {
            res.status(200).json({
                success: true,
                error: false,
                data: data
            })
        })

    } catch (error) {

    }
}
)

adminRouter.get('/view_user_package', async (req, res) => {
    try {
        const package = await packageDetails.find()
        // res.json(package)
        res.render("view_user_package", { package })
    } catch (error) {

    }

})

adminRouter.get('/', (req, res) => {
    res.render("dashboard")
})

adminRouter.get('/logout', (req, res) => {
    res.render('login')
})

adminRouter.post("/admin-login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    try {
        const oldUser = await loginData.findOne({ username })
        console.log(oldUser);
        if (!oldUser) return res.redirect('/')
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)
        if (!isPasswordCorrect) return res.redirect('/')
        if (oldUser.role === '0') {
            const admin = await loginData.findOne({ _id: oldUser._id })
            if (admin) {
                return res.redirect('/admin')
            }
        }
    } catch (error) {
        return res.status(500).redirect('/')
    }
})

adminRouter.get('/manage_user', (req, res) => {
    loginData.aggregate(

        [
            {
                '$lookup': {
                    'from': 'registration-tbs',
                    'localField': '_id',
                    'foreignField': 'login_id',
                    'as': 'user'
                }
            },
            {
                "$unwind": "$user"
            },
            {
                "$match": {
                    "role": "2"
                }
            },
            {
                "$group": {
                    '_id': '$_id',
                    'username': { '$first': '$username' },
                    'name': { '$first': '$user.name' },
                    //'lastname': {'$first':'$user.lastname'},
                    'email': { '$first': '$user.email' },
                    'status': { '$first': '$status' },
                }
            }

        ]
    ).then((data) => {
        console.log(data);
        res.render("manage_user", { data })
    })
})

adminRouter.get('/approve-user/:id', async (req, res) => {
    const id = req.params.id
    try {
        loginData.updateOne({ _id: id }, { $set: { status: "1" } }).then((data) => {
            res.redirect('/admin/manage_user')
        })

    } catch (error) {

    }
}
)

adminRouter.get('/view-location', async (req, res) => {
    try {
        location.find().then((data) => {
            res.render('view_location', { data })
        })

    } catch (error) {

    }
}
)

adminRouter.get('/view-iv-category', async (req, res) => {
    try {
        ivcat.find().then((data) => {
            res.render('view_iv_category', { data })
        })

    } catch (error) {

    }
}
)

adminRouter.get('/view-category', async (req, res) => {
    try {
        category.find().then((data) => {
            res.render('view_category', { data })
        })

    } catch (error) {

    }
}
)

adminRouter.get('/delete-user/:id', async (req, res) => {
    const id = req.params.id
    try {
        loginData.deleteOne({ _id: id }).then((data) => {
            registration.deleteOne({ login_id: id }).then((details) => {
                res.redirect('/admin/manage_user')
            }
            )
        }
        )
    } catch (error) {

    }
}
)

adminRouter.get('/manage_travel_agent', (req, res) => {
    loginData.aggregate(

        [
            {
                '$lookup': {
                    'from': 'travel_agent-tbs',
                    'localField': '_id',
                    'foreignField': 'login_id',
                    'as': 'user'
                }
            },
            {
                "$unwind": "$user"
            },
            {
                "$match": {
                    "role": "1"
                }
            },
            {
                "$group": {
                    '_id': '$_id',
                    'username': { '$first': '$username' },
                    'name': { '$first': '$user.name' },

                    'email': { '$first': '$user.email' },
                    'status': { '$first': '$status' },
                }
            }

        ]
    ).then((data) => {
        console.log(data);
        res.render("manage_travel_agent", { data })
    })
})

adminRouter.get('/approve-agent/:id', async (req, res) => {
    const id = req.params.id
    try {
        loginData.updateOne({ _id: id }, { $set: { status: "1" } }).then((data) => {
            res.redirect('/admin/manage_travel_agent')
        })

    } catch (error) {

    }
})

adminRouter.get('/delete-location/:id', async (req, res) => {
    const id = req.params.id
    try {
        location.deleteOne({ _id: id }).then((data) => {

            res.redirect('/admin/view-location')

        })
    } catch (error) {

    }
}
)
adminRouter.get('/delete-iv-category/:id', async (req, res) => {
    const id = req.params.id
    try {
        ivcat.deleteOne({ _id: id }).then((data) => {

            res.redirect('/admin/view-iv-category')

        })
    } catch (error) {

    }
}
)
adminRouter.get('/delete-category/:id', async (req, res) => {
    const id = req.params.id
    try {
        category.deleteOne({ _id: id }).then((data) => {

            res.redirect('/admin/view-category')

        })
    } catch (error) {

    }
}
)
adminRouter.get('/delete-agent/:id', async (req, res) => {
    const id = req.params.id
    try {
        loginData.deleteOne({ _id: id }).then((data) => {
            registration.deleteOne({ login_id: id }).then((details) => {
                res.redirect('/admin/manage_travel_agent')
            }
            )
        }
        )
    } catch (error) {

    }
}
)



adminRouter.get('/view_agent_package', async (req, res) => {
    try {
        const package = await agentaddpackage.find()
        // res.json(package)
        res.render("view_agent_package", { package })
    } catch (error) {

    }

})



// adminRouter.get('/manage_category',(req,res)=>{
//     res.render("manage_category")
// })

adminRouter.get('/add_category', (req, res) => {
    res.render("add_category")
})


adminRouter.get('/add_location', (req, res) => {
    res.render("add_location")
})



adminRouter.get('/add_iv_category', (req, res) => {
    res.render("add_iv_category")
})

adminRouter.get('/add_iv_city', (req, res) => {
    res.render("add_iv_city")
})

adminRouter.get('/view_payment', async (req, res) => {
    try {
        const data = await userpackage.aggregate([
            {
                '$lookup': {
                    'from': 'userplan-tbs',
                    'localField': 'package_id',
                    'foreignField': '_id',
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
                '$unwind': '$plan'
            },
            {
                '$unwind': '$user'
            },
            {
                '$group': {
                    '_id': '$_id',
                    'package_name': { '$first': "$plan.package_name" },
                    'budget': { '$first': "$plan.budget" },
                    'persons': { '$first': "$plan.persons" },
                    'wherelocation': { '$first': "$plan.wherelocation" },
                    'fromlocation': { '$first': "$plan.fromlocation" },
                    'username': { '$first': "$user.name" },
                    'email': { '$first': "$user.email" },
                    'phonenumber': { '$first': "$user.phonenumber" },
                    'mode': { '$first': "$mode" },
                    'date': { '$first': "$date" },
                }
            }
        ])
        //   res.json(data)
        res.render("view_payment", { data })
    } catch (error) {

    }



})







adminRouter.post('/save', async (req, res) => {
    try {
        const categoryname = req.body.categoryname
       const data =  await company.findOne(categoryname)
if(data){
   return res.redirect("/admin/add_iv_category")
}
        var categoryDetails = await company(categoryname).save()
        if (categoryDetails) {
           return res.redirect("/admin/add_iv_category")
            // res.status(201).json({ success: true, error: false, message: "category added", details: categoryDetails });
        }


    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "something went wrong" });
        console.log(error);
    }

})

module.exports = adminRouter