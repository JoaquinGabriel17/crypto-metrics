import mongoose from "mongoose";

const CryptoCacheSchema = new mongoose.Schema({
  lastUpdated: {
    type: Date,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

// Usamos colección "cryptoCache", siempre un solo doc
export default mongoose.model("CryptoCache", CryptoCacheSchema);
