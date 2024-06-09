import mongoose from 'mongoose';
const sensorDataSchema = new mongoose.Schema({
    timestamp: Date,
    temperature_f: Number,
    temperature_c: Number,
    humidity: Number,
});
export default mongoose.models.SensorData || mongoose.model('SensorData', sensorDataSchema);