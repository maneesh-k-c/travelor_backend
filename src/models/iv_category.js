const mongoose = require('mongoose')


const schema = mongoose.Schema
const categorySchema = new schema({
    
    iv_categoryname:{type:String}
})

const category = mongoose.model('iv-category-tb',categorySchema)
module.exports = category