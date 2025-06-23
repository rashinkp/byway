import { Router } from "express";
import { SearchController } from "../../http/controllers/search.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { optionalAuth } from "../middlewares/auth.middleware";

export function searchRouter(searchController: SearchController): Router {
  const router = Router();

  router.get("/", optionalAuth, (req, res) =>
    expressAdapter(req, res, searchController.globalSearch.bind(searchController))
  );

  return router;
} 