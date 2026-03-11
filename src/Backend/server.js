/* eslint-disable no-undef */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '.env') })
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import orderRouter from './routes/orderRoute.js'
import adminRouter from './routes/adminRoute.js'
import subscriberRouter from './routes/subscriberRoute.js'
import contactRouter from './routes/contactRoute.js'
import vapiRouter from './routes/vapiRoute.js'
import chatRouter from './routes/chatRoute.js'

const app = express()
const port = process.env.PORT || 4000

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Database & Services
connectDB()
connectCloudinary()

// API Routes
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/admin', adminRouter)
app.use('/api/subscribers', subscriberRouter)
app.use('/api/contact', contactRouter)
app.use('/api/vapi', vapiRouter)
app.use('/api/chat', chatRouter)

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        service: 'FAX Collections API',
        version: '1.0.0'
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler (Express requires 4 params for error middleware)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
    console.error('Server Error:', err.message)
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
    })
})

app.listen(port, () => {
    console.log(`FAX Collections API running on port ${port}`)
})