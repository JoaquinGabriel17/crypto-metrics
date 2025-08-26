import axios from "axios";
import CryptoCache from "../models/CryptoDataCache.js";

const API_URL = "https://api.coingecko.com/api/v3";
//La lógica de este archivo es para guardar datos obtenidos de la API de Coingecko como cache en la DB
//Con el fin de reducir el número de consultas realizadas a la API de Coingecko
// Tiempo de cache en minutos
const CACHE_DURATION_MINUTES = 60;

export const getMarketData = async (site, endpoint, params={}) => {
  if(!endpoint) return "ERROR: Debe enviar un endpoint por parámetro"

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
    console.log("Consultando datos nuevos a CoinGecko...");
    const response = await axios.get(`${API_URL}${endpoint}`, {params});
    const data = response.data;

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
    throw new Error("Error al obtener datos de CoinGecko: " + error.message);
  }
};

export const getTrendingCoins = async () =>{
  const coins = []

  try {
    // Buscar en Mongo
    let cache = await CryptoCache.findOne({site: 'trending'});

    const now = Date.now();

    if (cache) {
      const diffMinutes = (now - new Date(cache.lastUpdated).getTime()) / 1000 / 60;

      // Si el cache sigue vigente
      if (diffMinutes < CACHE_DURATION_MINUTES) {
        console.log("Devolviendo datos cacheados de Mongo...");
        
        return cache.data;
      }
    }

    //  Si no hay cache o ya venció → pedir a CoinGecko
    console.log("Consultando datos nuevos a CoinGecko...");
    const response = await axios.get(`${API_URL}/search/trending`);
    response.data.coins.slice(0,10).map((coin, index) => {
      if(index >= 10) return
      coins.push({
        image: coin.item.thumb,
        name: coin.item.name,
        symbol: coin.item.symbol,
        current_price: coin.item.data.price,
        price_change_percentage_24h: coin.item.data.price_change_percentage_24h.usd
      })
    })
    return coins
  } catch (error) {
    console.log(error)
  }
}