import dbConnect from '../../utils/dbConnect';
import RelayStatus from '../../models/RelayStatus';

export default async function handler(req, res) {
    await dbConnect();

    const data = await RelayStatus.find({});
    res.json(data);
}