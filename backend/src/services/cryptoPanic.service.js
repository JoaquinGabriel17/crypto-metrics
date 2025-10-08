import axios from "axios";
import CryptoCache from "../models/CryptoDataCache.js";



export const getNews = async () => {

    const API_TOKEN = process.env.PANIC_CRYPTO_TOKEN;
    const API_URL = "https://cryptopanic.com/api/developer/v2/posts/";
    const PARAMS = `?public=true&auth_token=${API_TOKEN}&regions=es`
    const site = 'crypto-panic-news';

// Tiempo de cache en minutos
    const CACHE_DURATION_MINUTES = 60;

  console.log("ENTRE A GET NEWS", API_TOKEN);
  let data = []

  try {
    // 1. Buscar en Mongo
    let cache = await CryptoCache.findOne({site: site});

    const now = Date.now();

    if (cache) {
      const diffMinutes = (now - new Date(cache.lastUpdated).getTime()) / 1000 / 60;

      // Si el cache sigue vigente
      if (diffMinutes < CACHE_DURATION_MINUTES) {
        console.log("Devolviendo datos cacheados de Mongo...");
        
        return cache.data;
      }
    }

    // 2. Si no hay cache o ya venció → pedir a CoinGecko
    console.log("Consultando datos nuevos a CryptoPanic...");
    const response = await axios.get(`${API_URL}${PARAMS}`);

    data = response.data;

    // 3. Guardar/actualizar en Mongo
    if (cache) {
      cache.lastUpdated = new Date(now);
      cache.data = data;
      cache.site = site;
      await cache.save();
    } else {
      cache = new CryptoCache({
        lastUpdated: new Date(now),
        data,
        site
      });
      await cache.save();
    }

    return data;
  } catch (error) {
    console.log(error.response.data)
    throw new Error("Error al obtener datos de CryptoPanic: " + error.response.data.error);
  }
};
