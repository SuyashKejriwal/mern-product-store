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

//@desc Get all Users
//@route GET /api/users
//@access PRIVATE/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    // will return all the users
    res.json(users);
})

//@desc Delete User
//@route DELETE /api/users/:id
//@access PRIVATE/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    // will find the specific user

    if(user){
        await user.remove();
        res.json({message: 'User Removed' })
    }else{
        const error = new Error(`User not found`);
           res.json({
           message: error.message,
           stack: process.env.NODE_ENV==='production' ? null : null,
       })
    }
})

//@desc Get User by ID
//@route GET /api/users/:id
//@access PRIVATE/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    // will find the specific user 
    if(user){
        res.json(user);
    }
    else{
        const error = new Error(`User not found`);
           res.json({
           message: error.message,
           stack: process.env.NODE_ENV==='production' ? null : null,
       })
    }
    
})

//@desc Update User 
//@route PUT /api/users/:id
//@access PRIVATE/ADMIN
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
     //console.log(user);
    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin= req.body.isAdmin // will update the isAdmin status of user
        
        const updatedUser = await user.save()
       res.send(
           {
           _id: updatedUser._id,
           name: updatedUser.name,
           email: updatedUser.email,
           isAdmin: updatedUser.isAdmin
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
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}