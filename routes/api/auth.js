const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth'); //Use Middleware created
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');


// @route    GET api/auth
// @desc     Get user by token
// @access   Public
router.get('/', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  
//@route  POST api/auth
//@desc   Authenticate user and get token
//@access Public
router.post('/',
    [
        check('email', 'Please include valid email').isEmail(),
        check('password', 'Password is Required').exists()
    ] //Express-Validator/check on fields
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
      //  console.log(req.body); //return json in console
      
        const {email, password } = req.body;

        try {
            //See if user exits
            let user = await User.findOne({email})
            if(!user){
                res.status(400).json({errors: [{msg: 'Invalid Credentials'}]});
            }

            //Check if password matches (Use Bcrypt)
            const isMatch = await bcrypt.compare(password, user.password); //Compare user entered vs in db
            if(!isMatch){
                return res
                    .status(400)
                    .json({errors:[{msg: "invalid credentials"}]})
            }
            
            const payload = {
                user: {
                    id: user.id //get id from promise from user above
                }
            };
            //Verify token 
            jwt.sign(
                payload, 
                config.get('jwtSecret'),
                {expiresIn: 36000},
                (err, token) => { //Call back for error handling, if no error send token back to client
                if(err) throw err;
                res.json({token}) }
                );

        } catch (err) {
            console.error(err.mesage);
            res.status(500).send('Server Error');
        }

    });

module.exports = router;