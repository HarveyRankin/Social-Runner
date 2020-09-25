const jwt = require('jsonwebtoken')


module.exports = (req,res,next) => {
    try{
    //get token from header
    const token = req.headers.authorization.split(" ")[1];
    //verify token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    //set userdata to the payload to be used within other middleware
    req.userData = decoded;
    next();
    } catch (err) {
        //if error send error code
        return res.status(401).json({
            message: 'Auth Failed'
        })
    }
};

