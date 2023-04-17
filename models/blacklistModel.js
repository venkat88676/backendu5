
const mongoose=require("mongoose")
const blacklistSchema=mongoose.Schema({
    token:String   
},{
    versionKey:false
})

const BlacklistModel=mongoose.model("blacklisted",blacklistSchema)

module.exports={BlacklistModel}