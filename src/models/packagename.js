const mongoose = require('mongoose')



const schema = mongoose.Schema
const packagenameSchema = new schema({
    category_id:{type:mongoose.Types.ObjectId,ref:"category-tb"},
    city_id:{type:mongoose.Types.ObjectId,ref:"city-tb"},
    package_name:{type:String},
    budget:{type:String},
    
    
    
})

const packagename = mongoose.model('packagename-tb',packagenameSchema)
module.exports = packagename