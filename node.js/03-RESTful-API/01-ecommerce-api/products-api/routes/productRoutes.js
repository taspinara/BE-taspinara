import express from 'express';
import { 
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
 } from "../controllers/productController.js";

 const router = express.Router();

 router.route('/')
    .get(getAllProducts)
    .post(createProduct)
    .all((req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

 router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct)
    .all((req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

export default router;