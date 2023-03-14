import { Router } from "express";

import {
  getAll,
  getById,
  getRTP,
  updateProduct,
  create,
} from "../controller/product.controler.js";

const router = Router();

router.get("/", getAll);

router.get("/realtimeproducts", getRTP);

router.get("/:id", getById);

router.post("/", create);

router.put("/:pid", updateProduct);

export default router;
