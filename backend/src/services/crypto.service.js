import axios from "axios";
import CryptoCache from "../models/CryptoDataCache.js";

const API_URL = "https://api.coingecko.com/api/v3";
//La lógica de este archivo es para guardar datos obtenidos de la API de Coingecko como cache en la DB
//Con el fin de reducir el número de consultas realizadas a la API de Coingecko
// Tiempo de cache en minutos
const CACHE_DURATION_MINUTES = 60;

export const getMarketData = async () => {
  try {
    // 1. Buscar en Mongo
    let cache = await CryptoCache.findOne();

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
    console.log("Consultando datos nuevos a CoinGecko...");
    const response = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 250,
        page: 1,
        sparkline: false,
        price_change_percentage: "1h,7d,24h"
      },
    });

    const data = response.data;

    // 3. Guardar/actualizar en Mongo
    if (cache) {
      cache.lastUpdated = new Date(now);
      cache.data = data;
      await cache.save();
    } else {
      cache = new CryptoCache({
        lastUpdated: new Date(now),
        data,
      });
      await cache.save();
    }

    return data;
  } catch (error) {
    throw new Error("Error al obtener datos de CoinGecko: " + error.message);
  }
};
