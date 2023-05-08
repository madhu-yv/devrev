const mongoose=require("mongoose")

const Schema = mongoose.Schema;

const UserSchema = Schema({
    firstname:{
        type:String,
    },
    lastname:{
        type:String
    },
    
    age:{
        type:Number,
    },

    email: {
        type:String,
    },

    phone: {
        type:Number,
    },

    aadhar: {
        type:Number,
    },

    address: {
        type:String,
    },

    state: {
        type:String,
    },
    slot:{
        type:String
    },
    center:{
        type:String
    }
    ,
    createdEvents: [
        {
          type: Schema.Types.ObjectId,
          ref: 'slots'
        }
      ]
})

module.exports=mongoose.model("Userdetails",UserSchema)