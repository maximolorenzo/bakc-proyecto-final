import { Router } from "express";
import { generateProduct } from "../utils.js";

const router = Router();

router.get("/", async (req, res) => {
  const productFake = [];

  for (let i = 0; i < 100; i++) {
    productFake.push(generateProduct());
  }

  res.send({ status: "success", payload: productFake });
});

export default router;
