import axios from "axios";
import CryptoCache from "../models/CryptoDataCache.js";

const API_URL = "https://api.coingecko.com/api/v3";
//La lógica de este archivo es para guardar datos obtenidos de la API de Coingecko como cache en la DB
//Con el fin de reducir el número de consultas realizadas a la API de Coingecko
// El parámetro "site" es el que indica el lugar donde será utilizada la información y es el identificador con el que se guarda el cache en la BD

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

//TRENDING COINS
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
      coins.push({
        image: coin.item.thumb,
        name: coin.item.name,
        symbol: coin.item.symbol,
        current_price: coin.item.data.price,
        price_change_percentage_24h: coin.item.data.price_change_percentage_24h.usd
      })
    })
     // Guardar/actualizar en Mongo
    if (cache) {
      cache.lastUpdated = new Date(now);
      cache.data = coins;
      cache.site = "trending";
      await cache.save();
    } else {
      cache = new CryptoCache({
        lastUpdated: new Date(now),
        data: coins,
        site: 'trending'
      });
      await cache.save();
    }
    return coins
  } catch (error) {
    console.log(error)
  }
}


// CATEGORÍAS
export const getCategoriesData = async (site) =>{
  const categories = []

  try {
    // Buscar en Mongo
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
    //  Si no hay cache o ya venció → pedir a CoinGecko
    console.log("Consultando datos nuevos a CoinGecko...");

    if(site == 'categories-trending'){
      const response = await axios.get(`${API_URL}/search/trending`);
      response.data.categories.map((category) => {
        categories.push({
          name: category.name,
          market_cap_1h_change: category.market_cap_1h_change,
          coins_count: category.coins_count,
          market_cap: category.data.market_cap,
          volume: category.data.total_volume,
          market_cap_change_percentage_24h: category.data.market_cap_change_percentage_24h.usd,
          image: category.sparkline,
        })
      })
       //  Guardar/actualizar en Mongo
    
       if (cache) {
      cache.lastUpdated = new Date(now);
      cache.data = categories;
      cache.site = site;
      await cache.save();
    } else {
      cache = new CryptoCache({
        lastUpdated: new Date(now),
        data: categories,
        site
      });
      await cache.save();
    }
      return categories
    }
    else {
      const response = await axios.get(`${API_URL}/coins/categories`);
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
    }


  } catch (error) {
    
  }
}