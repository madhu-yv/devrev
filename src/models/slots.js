const mongoose=require("mongoose")
const Schema = mongoose.Schema;

const UserSchema=Schema({
    centerName:{
        type:String,
    },
    centerAddress:{
        type:String,
    },
    
    available:{
        type:Number,
    },

    district: {
        type:String,
    },

    state: {
        type:String,
    },

    city: {
        type:String,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Userdetails'
    }
})

module.exports=mongoose.model("slots",UserSchema)