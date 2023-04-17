
const express=require("express")
const {connection}=require("./db")
const {userRouter}=require("./router/userRouter")
const {blogRouter}=require("./router/blogRouter")
const {authenticate}=require("./middleware/authenticate")
const app=express()
require("dotenv").config()

app.use(express.json())

app.use("/user",userRouter)
app.use("/blog",authenticate,blogRouter)


app.listen(process.env.port,async(req,res)=>{
    try{
        await connection;
        console.log(`port running at ${process.env.port}`)
    }catch(err){
        console.log({msg:err})
    }
})