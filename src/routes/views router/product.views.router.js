import { Router } from "express";

import productsModel from "../../dao/models/products.models.js";

const router = Router();

router.get("/", async (req, res) => {
  const limit = req.query?.limit || 10;
  const page = req.query?.page || 1;
  const filter = req.query?.filter || "";

  const search = {};
  if (filter) {
    search.title = filter;
  }

  const options = { limit, page, lean: true };

  const data = await productsModel.paginate(search, options);
  //console.log(JSON.stringify(data, null, 2, "\t"));

  res.render("products", data);
});

export default router;
