import { Router } from "express";
import { fetchMarketData, fetchTrendingCoins,fetchCategoryData } from "../controllers/crypto.controller.js";

const router = Router();

router.get("/market-data", fetchMarketData);
router.get("/trending-coins", fetchTrendingCoins)
router.get("/categories", fetchCategoryData)

export default router;
