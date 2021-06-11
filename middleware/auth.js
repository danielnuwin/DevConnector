const jwt = require('jsonwebtoken');
const config = require('config');

//Middleware function has access to the req/res cycle/objects and next is a callback 
//to run so it can move on. Exporting middleware that has req/res from it. 
module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token'); //getting token from header  

    //Check if no token
    if (!token) {
        return res.status(401).json({ msg: "No Token, Authorization Denied" });
    }
    //Verify Token if there's one
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); //decode token
        req.user = decoded.user; //User in payload and set the user
        next();
    } catch (err) {
        res.status(401).json({msg: 'Toekn is not valid'});
    }
}