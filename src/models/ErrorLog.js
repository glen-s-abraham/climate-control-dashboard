import mongoose from 'mongoose';
const errorLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    error: String,
});
export default mongoose.models.ErrorLog || mongoose.model('ErrorLog', errorLogSchema);