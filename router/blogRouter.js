const express=require("express")
const {BlogModel}=require('../models/blogModel')
const {authorise}=require("../middleware/authorise")
const blogRouter=express.Router()
const jwt=require("jsonwebtoken")

require("dotenv").config()

blogRouter.get('/',authorise(["user"]),async(req,res)=>{

    const token=req.headers.authorization.split(' ')[1];
    jwt.verify(token,process.env.JWT_SECRET,async(err,decoded)=>{
        console.log(decoded.email)
        if(decoded){
            let {email}=decoded
            let posts= await BlogModel.find({email})
            res.send(posts)
        }
        else{
            res.send(`error msg: ${err.message}`)
           
        }
    })
    
})

blogRouter.post('/add',authorise(["user"]),async(req,res)=>{
    try{
        const payload=req.body
        const post=new BlogModel(payload)
        await post.save()
         res.status(200).send({"msg":"New Post Added"}) 
    }catch(err){
        res.status(400).send({"msg":err.message}) 
    }
    
})

blogRouter.patch('/update/:id',authorise(["user"]),async(req,res)=>{
    const postId=req.params.id
    const payload=req.body;
    try{
        await BlogModel.findByIdAndUpdate({_id:postId},payload)
         res.status(200).send({"msg":`Note with id:${postId} has updated`})
    }catch(err){
        res.status(400).send({"msg":err.message})
    }
    
})

blogRouter.delete('/delete/:id',authorise(["user","moderator"]),async(req,res)=>{
    const postId=req.params.id
    try{
        await BlogModel.findByIdAndDelete({_id:postId})
        res.send({"msg":`Note with id:${postId} has Deleted`})
    }
    catch(err){
        res.send(err)
    }
    
})

module.exports={blogRouter}