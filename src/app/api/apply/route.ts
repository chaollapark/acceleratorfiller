
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const client = await clientPromise;
      const db = client.db('accelerator-filler');
      const collection = db.collection('applications');
      const result = await collection.insertOne(req.body);
      res.status(200).json({ success: true, result });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
