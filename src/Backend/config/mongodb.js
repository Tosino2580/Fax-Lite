/* eslint-disable no-undef */
import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully')
    })

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err.message)
    })

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'fax_collections',
            serverSelectionTimeoutMS: 10000,
        })
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message)
        console.error('The server will keep running — fix your connection and restart.')
    }
}

export default connectDB