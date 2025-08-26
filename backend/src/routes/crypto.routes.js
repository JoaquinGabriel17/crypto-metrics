import { Router } from "express";
import { fetchMarketData, fetchTrendingCoins } from "../controllers/crypto.controller.js";

const router = Router();

router.get("/market-data", fetchMarketData);
router.get("/trending-coins", fetchTrendingCoins)

export default router;
