<<<<<<< HEAD
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

console.log(process.env.MONGO_URI);
export default connectDB;
=======
const mongoose = require('mongoose');
const dns = require('dns');

// Force Google DNS to resolve MongoDB Atlas SRV records
// (required when local network DNS does not support SRV lookups)
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
>>>>>>> f433320e63b0b06420c9a1d7e9143a961f6f97f7
