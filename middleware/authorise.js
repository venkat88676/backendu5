const authorise=(permittedRole)=>{
    return (req,res,next)=>{
        const userRole=req.role;
        if(permittedRole.includes(userRole)){
            next()
        }
        else{
            res.send("Unauthorised")
        }
    } 
}

module.exports={authorise}