const mongoose = require('mongoose')


const schema = mongoose.Schema
const citySchema = new schema({
    
    category_id:{type:mongoose.Types.ObjectId,ref:"category-tb"},
    categoryname:{type:String},
    cityname:{type:String},

    
})

const city = mongoose.model('city-tb',citySchema)
module.exports = city