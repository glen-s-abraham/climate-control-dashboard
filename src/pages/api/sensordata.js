import dbConnect from '../../utils/dbConnect';
import SensorData from '../../models/SensorData';

export default async function handler(req, res) {
    await dbConnect();

    const data = await SensorData.find({});
    res.json(data);
}