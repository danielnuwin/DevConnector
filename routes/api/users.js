const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//@route  POST api/users
//@desc   Register User
//@access Public
router.post('/',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include valid email').isEmail(),
        check('password', 'please enter a password with 6 or more characters').isLength({ min: 6 })
    ] //Express-Validator/check on fields
    , async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body); //return json in console

        const { name, email, password } = req.body;

        try {
            //See if user exits
            let user = await User.findOne({ email })
            if (user) {
                res.status(400).json({ errors: [{ msg: 'User alreay exists' }] });
            }
            //Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });

            //Encrypt password with bcrypt
            const salt = await bcrypt.genSalt(10); //10 rounds for secure and salt??
            user.password = await bcrypt.hash(password, salt); //creates a hash 
            await user.save(); //Save to the database, anything with promise put await in from. 

            //Return jsonwebtoken > so on frontend user can be loggedin quickly
            // res.send('User Registered') //No Longer needed 

            const payload = {
                user: {
                    id: user.id //get id from promise from user above
                }
            }
            //Verify token 

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: '5 days' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }

    });

module.exports = router;