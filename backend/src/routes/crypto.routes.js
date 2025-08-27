import { Router } from "express";
import { fetchMarketData } from "../controllers/crypto.controller.js";

const router = Router();

router.get("/market-data", fetchMarketData);

export default router;
