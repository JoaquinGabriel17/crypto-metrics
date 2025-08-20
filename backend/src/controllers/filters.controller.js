export async function getFilters(req, res, next) {
  try {
    const symbols = (process.env.BINANCE_SYMBOLS || '').split(',').map(s => s.trim()).filter(Boolean);
    const ranges = [ '24h', '7d', '30d' ];
    const intervals = [ '1m', '5m', '15m', '1h', '4h', '1d' ];
    res.json({ symbols, ranges, intervals });
  } catch (e) { next(e); }
}
