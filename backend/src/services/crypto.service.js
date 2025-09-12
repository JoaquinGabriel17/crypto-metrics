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
  if(!site) return "ERROR: Debe enviar un site por parámetro"
  console.log(params)
  
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
    console.log("Consultando datos nuevos a CoinGecko...");
    const response = await axios.get(`${API_URL}${endpoint}`, {params});

    // La estructura de la información devuelta por el endpoint /search/trending difiere
    // Se realiza un paso mas antes de devolver la información
    if(site == 'trending-coins'){
    response.data.coins.slice(0,10).map((coin, index) => {
      data.push({
        image: coin.item.thumb,
        name: coin.item.name,
        symbol: coin.item.symbol,
        current_price: coin.item.data.price,
        price_change_percentage_24h: coin.item.data.price_change_percentage_24h.usd
      })
    })
    }

    // Si la consulta es al mismo endpoint /search/trending pero se necesita obtener las categorías
    else if(site == 'categories-trending'){
      response.data.categories.slice(0,10).map((category) => {
        data.push({
          name: category.name,
          market_cap_1h_change: category.market_cap_1h_change,
          coins_count: category.coins_count,
          market_cap: category.data.market_cap,
          volume: category.data.total_volume,
          market_cap_change_24h: category.data.market_cap_change_percentage_24h.usd,
          sparkline: category.sparkline,
        })
      })
    }
    // Si la consulta es al mismo endpoint /search/trending pero se necesita obtener los NTFS
    else if(site == 'nfts-trending'){
      response.data.nfts.map((nft) => {
        data.push({
          name: nft.name,
          floor_price_24h_percentage_change: nft.floor_price_24h_percentage_change,
          symbol: nft.symbol,
          image: nft.thumb,
          floor_price: nft.data.floor_price,
          h24_volume: nft.data.h24_volume,
          sparkline: nft.data.sparkline,
        })
      })
    }
    else data = response.data;

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
    throw new Error("Error al obtener datos de CoinGecko: " + error.response.data.error);
  }
};
