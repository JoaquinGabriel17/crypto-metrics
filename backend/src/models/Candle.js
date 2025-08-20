import mongoose from 'mongoose';

const CandleSchema = new mongoose.Schema({
  symbol: { type: String, index: true },
  interval: { type: String, index: true },
  openTime: { type: Number, index: true }, // ms epoch
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number,
}, { timestamps: true });

CandleSchema.index({ symbol: 1, interval: 1, openTime: 1 }, { unique: true });

export default mongoose.model('Candle', CandleSchema);