const mongoose = require('mongoose')



const schema = mongoose.Schema
const packageDetailsSchema = new schema({
    category_id:{type:mongoose.Types.ObjectId,ref:"category-tb"},
    city_id:{type:mongoose.Types.ObjectId,ref:"city-tb"},
    packagename_id:{type:mongoose.Types.ObjectId,ref:"packagename-tb"},
    packagename:{type:String},
    budget:{type:Number},
    activity:{type:String},
    weatherdetails:{type:String},
    distance:{type:String},
    description:{type:String}
    
})

const packageDetails = mongoose.model('packageDetails-tb',packageDetailsSchema)
module.exports = packageDetails