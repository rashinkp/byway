import { Router } from "express";
import { SearchController } from "../../http/controllers/search.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export function searchRouter(searchController: SearchController): Router {
  const router = Router();

  router.get("/global", (req, res, next) =>
    expressAdapter(req, res, searchController.globalSearch.bind(searchController), next)
  );

  return router;
} 