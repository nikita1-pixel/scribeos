const  mongoosdb = require('mongoose');

const connectDB = async () =>{
    try {
        await mongoosdb.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;