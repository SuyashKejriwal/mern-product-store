import asyncHandler from 'express-async-handler'
import Product from '../models/product.js'

//@desc Fetch all products
//@route GET /api/products/
//@access Public routes
const getProducts =  asyncHandler(async (req,res) => {
    const pageSize=4;
    const page= Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? {
        name : {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count= await Product.countDocuments({...keyword })
    const products = await Product.find({ ...keyword })
    .limit(pageSize).
    skip(pageSize*(page - 1));

    //get all the products 
    res.json( { products, page, pages: Math.ceil(count/pageSize) });
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

    const { name,
        price,
        description,
        image,
        brand,
        category,
        countInStock }= req.body;

    const product={
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock
    }
    console.log(product);
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
//@route Put /api/product/:id
//@access Private/Admin
const updateProduct= asyncHandler(async(req,res) => {

    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock
      } = req.body

    const product = await Product.findById(req.params.id);
    //console.log(req.body.price);

    if(product){
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

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

//@desc Get Top Rated Products
//@route GET /api/products/top
//@access Public 
const getTopProducts =  asyncHandler(async (req,res) => {
    console.log(`In the top products controller`);
    const products=await Product.find({}).sort({ratings: -1}).limit(3);

    res.json(products)
   })


//@desc  Create new Review
//@route POST /api/product/:id/reviews
//@access Private
const createProductReview= asyncHandler(async(req,res)=>{

    const { rating, comment } = req.body;

    const product=await Product.findById(req.params.id);

    if(product){
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.
        user._id.toString());

        if(alreadyReviewed){
             const error = new Error(`Product Already Reviewed`);
               res.json({
               message: error.message,
               stack: process.env.NODE_ENV==='production' ? null : null,
           })
        }

        const review={
            name:req.user.name,
            ratings: Number(rating),
            comment,
            user:req.user._id
        }

        product.reviews.push(review);

        product.numReviews=product.reviews.length;

        product.rating= product.reviews.reduce((acc,item)=> item.rating + acc,0)/product.reviews.length;

        await product.save();

    } else {
        const error = new Error(`product could not be find`);
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
    updateProduct,
    createProductReview,
    getTopProducts
}