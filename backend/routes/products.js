import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductsById,
  deleteProductById,
  createProduct,
  updateProduct
} from '../controllers/productController.js'
import { protect,admin } from '../middleware/authMiddleware.js'
// base url is 'api/products'

router.get('/', getProducts )

router.get('/:id', getProductsById )

router.delete('/:id',protect,admin,deleteProductById)

router.post('/',protect,admin,createProduct)

router.put('/:id',protect,admin,updateProduct)
 
export default router
