import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import productsRoute from './routes/products.js'
import usersRoute from './routes/users.js'
import ordersRoute from './routes/orders.js'
import connectDB from './config/db.js'
import {notFound,errorHandler} from './middleware/errorMiddleware.js'
const app = express();

dotenv.config();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
} 

connectDB();

app.use(express.json())

app.use(notFound);

app.use(errorHandler);

//Routes
app.use('/api/products', productsRoute);
app.use('/api/users', usersRoute);
app.use('/api/orders', ordersRoute);

// Paypal Config Routes
console.log(process.env.PAYPAL_CLIENT_ID);

app.get('/api/config/paypal', (req, res) => 
    res.send(process.env.PAYPAL_CLIENT_ID)
)


const PORT = process.env.PORT||5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.
Paypal client id is ${process.env.PAYPAL_CLIENT_ID}
`));