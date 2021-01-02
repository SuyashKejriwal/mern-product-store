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

//@desc  Delete a Product
//@route DELETE /api/products/:id
//@access Private/Admin
const deleteProductById=asyncHandler( async(req,res)  => {
    
        const product = await Product.findById(req.params.id);
        // will find the specific product
    
        if(product){
            await product.remove();
            res.json({message: 'product Removed' })
        }else{
            const error = new Error(`product not found`);
               res.json({
               message: error.message,
               stack: process.env.NODE_ENV==='production' ? null : null,
           })
        }
} )

//@desc  Create a Product
//@route POST /api/products
//@access Private/Admin
const createProduct= asyncHandler(async(req,res) => {

    const { product }= req.body;

    const productObject = await Product.create(product);

    if(productObject){
        res.json(productObject);
    }
    else{
        const error = new Error(`product not created`);
               res.json({
               message: error.message,
               stack: process.env.NODE_ENV==='production' ? null : null,
           })
    }
})

//@desc  Update the product
//@route Put /api/product/
//@access Private/Admin
const updateProduct= asyncHandler(async(req,res) => {

    const product = await Product.findById(req.params.id);

    if(product){
        product.name = req.body.name || product.name;

        const updatedProduct= await product.save();
        res.json(updatedProduct);
    }
    else{
        const error = new Error(`product not updated`);
               res.json({
               message: error.message,
               stack: process.env.NODE_ENV==='production' ? null : null,
           })
    }
})

export {
    getProducts,
    getProductsById,
    deleteProductById,
    createProduct,
    updateProduct
}