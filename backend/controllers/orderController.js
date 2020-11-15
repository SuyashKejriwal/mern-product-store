import asyncHandler from 'express-async-handler'
import Order from '../models/order.js'

//@desc Create new orders
//@route POST /api/orders
//@access Private
const addOrderItems =  asyncHandler(async (req,res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body

    if (orderItems && orderItems.length === 0) {
        const error = new Error(`No order items`);
            res.json({
            message: error.message,
            stack: process.env.NODE_ENV==='production' ? null : null,
        })
    }
    else {
        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        })

        const createdOrder = await order.save();

        res.json(createdOrder);
    }
    
})

//@desc Get order by ID
//@route GET /api/orders/:id
//@access Private
const getOrderById =  asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id).populate('user',
        'name email')
    
    if (order) {
        res.json(order);
    }
    else {
        const error = new Error(`Order not found`);
            res.json({
            message: error.message,
            stack: process.env.NODE_ENV==='production' ? null : null,
        })
    }
})

//@desc Update Order to Paid
//@route PUT /api/orders/:id/pay
//@access Private
const updateOrderToPaid =  asyncHandler(async (req,res) => {
    const order = await Order.findById(req.params.id);
    
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        }

        const updatedOrder = await order.save();


        res.json(updatedOrder);
    }
    else {
        const error = new Error(`Order not found`);
            res.json({
            message: error.message,
            stack: process.env.NODE_ENV==='production' ? null : null,
        })
    }
})

//@desc Get logged in user orders
//@route GET /api/orders/myorders
//@access Private
const getMyOrders =  asyncHandler(async (req,res) => {
    const orders = await Order.find({ user: req.user._id });
    console.log(orders);
    if (orders) {
        res.json(orders);
    }
    else {
        const error = new Error(`No order till now`);
            res.json({
            message: error.message,
            stack: process.env.NODE_ENV==='production' ? null : null,
        })
    }
})


export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders
}