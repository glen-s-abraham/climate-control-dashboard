import mongoose from 'mongoose';
const relayStatusSchema = new mongoose.Schema({
    timestamp: Date,
    relay1: String,
    relay2: String,
    message: String
});
export default mongoose.models.RelayStatus || mongoose.model('RelayStatus', relayStatusSchema);