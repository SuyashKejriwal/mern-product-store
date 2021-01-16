import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const protect = async (req, res, next) => {
    console.log(req.headers.authorization);
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
           // console.log(decoded);
            req.user= await User.findById(decoded.id).select('-password')
        } catch (err) {
          //  console.error(err);
            const error = new Error(`Not Authorized.No token`);
            res.json({
            message: error.message,
            stack: process.env.NODE_ENV==='production' ? null : null,
        })
        }
    }
    
    if (!token) {
        const error = new Error(`Not Authorized.No token`);
        res.json({
            message: error.message,
            stack: process.env.NODE_ENV==='production' ? null : null,
        })
    }
    next();
}

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        const error = new Error(`Not Authorized as an admin`);
        res.json({
            message: error.message,
            stack: process.env.NODE_ENV==='production' ? null : null,
        })
    }
}

export { protect,admin }