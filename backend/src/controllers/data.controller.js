import Candle from '../models/Candle.js';
import { getRangeMs } from '../utils/time.js';

export async function getHistorical(req, res, next) {
  try {
    const { range = '24h', symbol = 'BTCUSDT', interval = process.env.BINANCE_INTERVAL || '1m' } = req.query;
    const from = Date.now() - getRangeMs(range);
    const rows = await Candle.find({ symbol, interval, openTime: { $gte: from } })
      .sort({ openTime: 1 }).lean();
    res.json({ symbol, interval, range, rows });
  } catch (e) { next(e); }
}
