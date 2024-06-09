import dbConnect from '../../utils/dbConnect';
import ErrorLog from '../../models/ErrorLog';

export default async function handler(req, res) {
    await dbConnect();

    const data = await ErrorLog.find({});
    res.json(data);
}