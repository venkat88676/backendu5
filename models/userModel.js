
const mongoose=require("mongoose")
const userSchema=mongoose.Schema({
    name:{type:String,require:true},
    email:{type:String,unique:true },
    password:{type:String,require:true},
    role:{
        type:String,
        require:true,
        default:"user",
        enum:["user","moderator"]
    }
},{
    versionKey:false
})

const UserModel=mongoose.model("userC2",userSchema)

module.exports={UserModel}