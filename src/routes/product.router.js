import { Router } from "express";

import productsModel from "../dao/models/products.models.js";

const router = Router();

router.get("/", async (req, res) => {
  const products = await productsModel.find().lean().exec();
  res.render("index", { products: products });
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", { script: "index.js" });
});

router.post("/realtimeproducts", async (req, res) => {
  const product = req.body;

  const productAdd = await productsModel.create(product);

  res.render("realTimeProducts", { script: "index.js" });
});

// router.delete("/:pid", async (req, res) => {
//   const id = req.params.pid;
//   const productDeleted = await productsModel.deleteOne({ _id: id });

//   req.io.emit("updatedProducts", await productsModel.find().lean().exec());
//   res.json({
//     status: "Success",
//     massage: "Product Deleted!",
//     productDeleted,
//   });
// });
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productToUpdate = req.body;

  const product = await productsModel.updateOne(
    {
      _id: id,
    },
    productToUpdate
  );
  req.io.emit("socket01", await productsModel.find().lean().exec());
  res.json({
    status: "Success",
    product,
  });
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;
  const showProduct = await productsModel.findOne({ _id: id }).lean().exec();
  res.render("products", { showProduct });
});

export default router;
