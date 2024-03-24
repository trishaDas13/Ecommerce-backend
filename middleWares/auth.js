const jwt = require("jsonwebtoken");
const userModal = require("../model/user");

const authMiddleware = (role)=> async(req, res, next) => {
    // console.log(req.headers.authorization); //--> encoded user data
//   console.log(payload) //--> decoded  user data
  const payload = jwt.decode(req.headers.authorization);
  try {
    const verify = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );
    if (Date.now() >= payload.exp * 1000) {
        return res.status(401).json({
            success: false,
            message: "Your session has expired, please login first",
        });
    }
    
    const user = await userModal.findById(payload.id);
    if(user.token === null){
        return res.status(401).json({
            success: false,
            message: "You are logged out",
        });
    }
    if(role.includes(payload.role)){
        // if(user.token === req.headers.authorization){
            next(); 
        // }
       
    }else{
       return res.status(403).json({
            success: false,
            message: "you can not create any product you are not an admin or seller"
        })
    }
    
  } catch (err) {
    res.status(403).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = authMiddleware;