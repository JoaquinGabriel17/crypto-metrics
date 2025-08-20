import WebSocket from 'ws';
import Candle from '../models/Candle.js';

let onUpdateCb = () => {};
export function onPriceUpdate(cb) { onUpdateCb = cb; }

let ws;
let symbols = [];
const interval = process.env.BINANCE_INTERVAL || '1m';

// Auxiliar para agrupar trades en velas simples en servidor (muy básico)
const buckets = new Map(); // key: symbol|interval => { openTime, open, high, low, close, volume }

function bucketKey(symbol) { return `${symbol}|${interval}`; }

function getBucketStart(ts, intervalStr) {
  const d = new Date(ts);
  switch (intervalStr) {
    case '1m': d.setSeconds(0,0); break;
    case '5m': d.setSeconds(0,0); d.setMinutes(Math.floor(d.getMinutes()/5)*5); break;
    case '15m': d.setSeconds(0,0); d.setMinutes(Math.floor(d.getMinutes()/15)*15); break;
    case '1h': d.setMinutes(0,0,0); break;
    case '4h': d.setMinutes(0,0,0); d.setHours(Math.floor(d.getHours()/4)*4); break;
    case '1d': d.setHours(0,0,0,0); break;
    default: d.setSeconds(0,0);
  }
  return d.getTime();
}

export function startBinanceStream() {
  symbols = (process.env.BINANCE_SYMBOLS || 'BTCUSDT').split(',').map(s => s.trim()).filter(Boolean);
  const streams = symbols.map(s => `${s.toLowerCase()}@miniTicker`).join('/');
  const url = `wss://stream.binance.com:9443/stream?streams=${streams}`;

  ws = new WebSocket(url);

  ws.on('open', () => console.log('[binance] conectado', url));
  ws.on('close', () => {
    console.log('[binance] desconectado — reintentando en 3s');
    setTimeout(startBinanceStream, 3000);
  });
  ws.on('error', (err) => console.error('[binance] error', err.message));

  ws.on('message', async (raw) => {
    try {
      const data = JSON.parse(raw.toString());
      // data.stream, data.data
      const d = data.data; // miniTicker payload
      const symbol = d.s;  // símbolo, p.ej. BTCUSDT
      const price = parseFloat(d.c); // current close price
      const ts = d.E; // event time

      onUpdateCb({ symbol, price, ts }); // emitir a Socket.IO

      // Actualizar bucket para vela actual
      const key = bucketKey(symbol);
      const openTime = getBucketStart(ts, interval);
      let b = buckets.get(key);
      if (!b || b.openTime !== openTime) {
        // guardar el anterior si existe
        if (b) {
          await upsertCandle(symbol, interval, b);
        }
        b = { openTime, open: price, high: price, low: price, close: price, volume: 0 };
      } else {
        b.high = Math.max(b.high, price);
        b.low = Math.min(b.low, price);
        b.close = price;
      }
      buckets.set(key, b);
    } catch (e) {
      console.error('[binance] parse error', e.message);
    }
  });
}

async function upsertCandle(symbol, interval, b) {
  const doc = {
    symbol,
    interval,
    openTime: b.openTime,
    open: b.open,
    high: b.high,
    low: b.low,
    close: b.close,
    volume: b.volume,
  };
  await Candle.updateOne({ symbol, interval, openTime: b.openTime }, doc, { upsert: true });
}