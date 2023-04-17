
const mongoose=require("mongoose")
const blogSchema=mongoose.Schema({
    title:String,
    body:String,
    email:String
},{
    versionKey:false
})

const BlogModel=mongoose.model("blogs",blogSchema)

module.exports={BlogModel}