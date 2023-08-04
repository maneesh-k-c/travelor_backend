const mongoose = require('mongoose')


const schema = mongoose.Schema
const locationSchema = new schema({
    
    location:{type:String},
   
    
    
    
    
})

const userlocation = mongoose.model('location-tb',locationSchema)
module.exports = userlocation