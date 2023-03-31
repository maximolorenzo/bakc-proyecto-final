import { Router } from "express";
import { ProductService } from "../repository/index.js";
import { authorization } from "../utils.js";
const router = Router();

//get
router.get("/", async (req, res) => {
  const products = await ProductService.get();
  res.render("index", { products: products });
});

router.get("/realtimeproducts", authorization("admin"), async (req, res) => {
  res.render("realTimeProducts", { script: "index.js" });
});

router.post("/", async (req, res) => {
  const product = req.body;

  const productAdd = await ProductService.create(product);

  res.render("realTimeProducts", { script: "index.js" });
});

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productDeleted = await ProductService.delete(id);

  req.io.emit("updatedProducts", await ProductService.get());
  res.json({
    status: "Success",
    massage: "Product Deleted!",
    productDeleted,
  });
});
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productToUpdate = req.body;

  const product = await ProductService.update(
    {
      _id: id,
    },
    productToUpdate
  );
  req.io.emit("socket01", await ProductService.get());
  res.json({
    status: "Success",
    product,
  });
});

router.get("/:id", async (req, res) => {
  const id = req.params.pid;
  const showProduct = await ProductService.getById({ _id: id });
  res.render("products", { showProduct });
});

export default router;
