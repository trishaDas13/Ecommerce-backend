const mongoose = require('mongoose')

const userSchema = new mongoose.Schema ({
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    },
    token:{
        type: String
    },
    wishlist:{
        type: [mongoose.Schema.Types.ObjectId],
        default:[],
        
    }
})

module.exports=mongoose.model('users',userSchema)