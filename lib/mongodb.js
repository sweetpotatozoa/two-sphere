// lib/mongodb.js
import { MongoClient } from 'mongodb';

const isDev = process.env.NODE_ENV === 'development';
const dbName = isDev ? process.env.DB_NAME_DEV : process.env.DB_NAME_PROD;
const dbPassword = isDev ? process.env.DB_PASSWORD_DEV : process.env.DB_PASSWORD_PROD;

const uri = `mongodb+srv://admin:${dbPassword}@cluster0.8g8t9.mongodb.net/${dbName}?retryWrites=true&w=majority`;
const options = {};

let client;
let clientPromise;

if (!process.env.DB_NAME_DEV || !process.env.DB_NAME_PROD) {
    throw new Error('Please add your MongoDB database names to .env');
}

if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client
        .connect()
        .then((client) => {
            console.log('✅ MongoDB connected successfully');
            return client;
        })
        .catch((error) => {
            console.error('❌ MongoDB connection failed:', error);
            throw error;
        });
}
clientPromise = global._mongoClientPromise;

export default clientPromise;
