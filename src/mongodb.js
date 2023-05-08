const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/Backend_DevrevTutorial")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log("Failed to connected");
    })
    const SignupSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    })

    const collection = new mongoose.model("SignUpdetails",SignupSchema)

    module.exports = collection