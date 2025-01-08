const mongoose = require('mongoose')


const schema = mongoose.Schema
const placeSchema = new schema({
        
        userLoginId:{type:mongoose.Types.ObjectId,ref:"login-tb"},
        placeName:{type:String},
        description:{type:String},
        cityName:{type:String},
        image:{type:[String]},
        activity:{type:String}
        
})

const placeModel = mongoose.model('place-tb',placeSchema)
module.exports = placeModel