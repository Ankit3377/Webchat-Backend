const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middlewere/fetchuser');

const JWT_SECRET = "Ankitisabadb@y";


//Route 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be less than 5 character').isLength({ min: 5 }),
  body('url', 'Password cannot be less than 5 character').isLength({ min: 0 }),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success, errors: errors.array() });
  }
  // Check whether the user with this email exists already
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      success = false;
      return res.status(400).json({ success, error: "Sorry a user with this email aready exists" })
    }
    var salt = await bcrypt.genSaltSync(10);
    secPass = await bcrypt.hash(req.body.password, salt)
    //Create a new user
    user = await User.create({
      name: req.body.name,
      url: req.body.url,
      email: req.body.email,
      password: secPass
    });

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    success = false;
    console.log(error.message);
    res.status(500).send(success, "Internal Server error")
  }
})

//Route 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be empty').exists()
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false;
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({ success, error: "Email or password is incorrect" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, error: "Email or password is incorrect" });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    success = false;
    console.log(error.message);
    res.status(500).send(success, "Internal Server error");

  }

});

// Route 3: Get logged in user details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server error");
  }
})
module.exports = router;