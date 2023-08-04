const mongoose = require('mongoose')


const schema = mongoose.Schema
const userselectSchema = new schema({
        
    
        persons:{type:String},
        budget:{type:String},
        categoryname:{type:String},
        //activity:{type:String},
        requirements:{type:String},
        //agency:{type:String}
        
        
})

const userselect = mongoose.model('userselect-tb',userselectSchema)
module.exports = userselect