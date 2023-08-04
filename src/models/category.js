const mongoose = require('mongoose')


const schema = mongoose.Schema
const categorySchema = new schema({
    
    categoryname:{type:String}
})

const category = mongoose.model('category-tb',categorySchema)
module.exports = category