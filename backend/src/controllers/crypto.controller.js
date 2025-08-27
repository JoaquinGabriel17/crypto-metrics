import { getMarketData} from "../services/crypto.service.js";

export const fetchMarketData = async (req, res) => {
  
  try {

    const { site, endpoint, ...params } = req.query;

    if (!endpoint) {
      return res.status(400).json({ error: "El parámetro 'endpoint' es obligatorio" });
    }
    if (!site) {
      return res.status(400).json({ error: "El parámetro 'site' es obligatorio" });
    }
    const data = await getMarketData(site, endpoint, params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
