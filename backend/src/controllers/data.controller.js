import { getMarketData} from "../services/crypto.service.js";
import User from '../models/User.js';


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

//Obtener favoritos por ID de usuario
export async function getFavorites(req, res, next) {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ message: "ID de usuario es requerido" });
    
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json({ favorites: user.favorites });
  } catch (error) {
    next(error);
  }
}

// ACTUALIZAR favoritos
export async function updateFavorites(req, res, next) {
  try {
    const { id, favorites } = req.body;

    if (!id || !Array.isArray(favorites))  return res.status(400).json({ message: "ID de usuario o favoritos inválidos" });
    const updatedUser = await User.findByIdAndUpdate(id, { favorites }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json({ message: "Favoritos actualizados", favorites: updatedUser.favorites });
    
  } catch (error) {
    next(error);
  }
}