import { Router } from "express";
import { fetchMarketData, getFavorites, updateFavorites, fetchNews } from "../controllers/data.controller.js";


const router = Router();

router.get("/market-data", fetchMarketData);
router.get("/favorites",  getFavorites);
router.put("/favorites", updateFavorites);
router.get("/news", fetchNews);

export default router;
