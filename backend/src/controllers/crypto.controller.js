import { getMarketData, getTrendingCoins, getCategoriesData } from "../services/crypto.service.js";

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

export const fetchTrendingCoins = async (req,res) => {
  try {
    const data = await getTrendingCoins();
    res.json(data)
  } catch (error) {
    res.stauts(500).json({message: error.message})
  }
}

export const fetchCategoryData = async (req,res) => {
  const { site } = req.query
  if(!site) res.status(400).json({ error: "El parámetro 'site' es obligatorio" });
  try {
    const data = await getCategoriesData(site);
    res.json(data)
  } catch (error) {
    res.stauts(500).json({message: error.message})
  }
}