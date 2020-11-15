import asyncHandler from 'express-async-handler'
import User from '../models/user.js'
import generateToken from '../utils/generateToken.js'

//@desc Auth user & get token
//@route POST/api/users/login
//@access PUBLIC
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    const user = await User.findOne({ email })
    
    if (user && (await user.matchPassword(password))) {
        const matchedUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,    
            token: generateToken(user._id),
        }
        res.json(matchedUser);
    } else {
        const error = new Error(`Invalid email or password`);
        res.json({
            message: error.message,
            stack: process.env.NODE_ENV==='production' ? null : null,
        })
    }

})

//@desc Get User Profile
//@route GET /api/users/profile
//@access PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
     const user = await User.findById(req.user._id)
      console.log(user);
    if (user) {
        res.send(
            {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,    
            }
        )
    } else {
        const error = new Error(`User not found`);
            res.json({
            message: error.message,
            stack: process.env.NODE_ENV==='production' ? null : null,
        })
    }

   // res.send('Sucess in auth')
})

//@desc Register a new user
//@route POST/api
//@access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body

    if (name=='' || email=='' || password=='') {
        throw new Error('Please fill all the fields')
    }
    
    const userExists = await User.findOne({ email })
    
    if (userExists) {
        res.status(400)
        throw new Error('User Already Exists')
        
    } 

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,    
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

//@desc Update User Profile
//@route PUT /api/users/profile
//@access PRIVATE
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
     console.log(user);
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password=req.body.password
        }

        const updatedUser = await user.save()
       res.send(
           {
           _id: updatedUser._id,
           name: updatedUser.name,
           email: updatedUser.email,
           isAdmin: updatedUser.isAdmin,
           token: generateToken(updatedUser._id)
           }
       )
   } else {
       const error = new Error(`User not found`);
           res.json({
           message: error.message,
           stack: process.env.NODE_ENV==='production' ? null : null,
       })
   }

  // res.send('Sucess in auth')
})


export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile
}