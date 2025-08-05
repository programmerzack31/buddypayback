const jwt = require("jsonwebtoken");
const JWT_CODE = process.env.JWT_CODE

module.exports = function  (req,res,next){
    const token = req.header('Authorization').split(' ')[1];
     if(!token){
        return res.status(401).json({message:"No token Available!"});
     }
     try{
        const decoded = jwt.verify(token,JWT_CODE);
        req.user = decoded;
        next(); 
     }catch(err){
        console.error('Authorization failed',err);
        return res.status(500).json({message:"Token is not valid"});
     }
};