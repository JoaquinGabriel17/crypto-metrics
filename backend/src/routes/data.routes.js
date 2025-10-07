import { Router } from "express";
import { fetchMarketData, getFavorites, updateFavorites } from "../controllers/data.controller.js";


const router = Router();

router.get("/market-data", fetchMarketData);
router.get("/favorites",  getFavorites);
router.put("/favorites", updateFavorites);

export default router;
