import asyncHandler from 'express-async-handler'
import Product from '../models/product.js'

//@desc Fetch all products
//@route GET /api/products/
//@access Public routes
const getProducts =  asyncHandler(async (req,res) => {
  
    const products = await Product.find({});
    //get all the products 
    res.json(products);
})

//@desc Fetch Particular Product by id
//@route GET /api/products/:id
//@access Public routes
const getProductsById =  asyncHandler(async (req,res) => {
    try {
        const product = await Product.findById(req.params.id );
        //get the product by id 
        if (product) {
            res.json(product);
        }
        else {
            res.status(404)
            throw new Error('Product not found')
        }   
    }
    catch (err) {
       // console.log(err);
        res.status(404)
        throw new Error('Wrong Product ID')
    }
    
})

//@desc Create new Review
//@route POST /api/products/:id/reviews
//@access Private
// const getProductsById =  asyncHandler(async (req,res) => {
//     const { rating, comment } = req.body

// })

export {
    getProducts,
    getProductsById
}