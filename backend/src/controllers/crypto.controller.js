import { getMarketData } from "../services/crypto.service.js";

export const fetchMarketData = async (req, res) => {
  try {
    const data = await getMarketData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
