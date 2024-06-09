import mongoose from 'mongoose';

async function dbConnect() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    return mongoose.connect('mongodb://192.168.1.69:27017/sensorData', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

export default dbConnect;