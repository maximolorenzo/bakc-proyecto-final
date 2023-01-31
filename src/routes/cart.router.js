import { Router } from "express";

import cartModel from "../dao/models/cart.model.js";

const router = Router();
//muestra los carritos
router.get("/", async (req, res) => {
  const carts = await cartModel.find().lean().exec();
  res.json({ carts });
});

//crea el carrito
router.post("/", async (req, res) => {
  const cartNew = await cartModel.create({});

  res.json({ status: "success", cartNew });
});
//trae el carrito por id
router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const carts = await cartModel.findOne({ _id: id }).populate("products.id");
  res.render("cart", { data: carts });
});

//agrega un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const cartID = req.params.cid;
  const productID = req.params.pid;
  const quantity = req.body.quantity || 1;
  const cart = await cartModel.findById(cartID);

  let found = false;
  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].id == productID) {
      cart.products[i].quantity++;
      found = true;
      break;
    }
  }
  if (found == false) {
    cart.products.push({
      id: productID,
      quantity,
    });
  }
  await cart.save();

  res.json({ status: "success", cart });
});
//elemina un producto del carrito
router.delete("/:cid/product/:pid", async (req, res) => {
  const cartID = req.params.cid;
  const productID = req.params.pid;
  const quantity = req.body.quantity || 1;
  const cart = await cartModel.findById(cartID);

  if (!cart)
    return res.status(404).json({ status: "error", error: "cart not found" });

  const productIDX = cart.products.findIndex((p) => p.id == productID);
  if (productIDX < 0)
    return res
      .status(404)
      .json({ status: "error", error: "Product not found on cart" });

  cart.products.splice(productIDX, 1);

  await cart.save();

  res.json({ status: "success", cart });
});
//elemina todos los productos de un carrito
router.delete("/:cid", async (req, res) => {
  const cartID = req.params.cid;
  const cart = await cartModel.findById(cartID);
  cart.products = [];
  await cart.save();
  res.json({
    status: "Success",
    massage: "Product Deleted!",
    cart,
  });
});
//actualizar carrito
router.put("/:cid", async (req, res) => {
  const cartID = req.params.cid;
  const cartUpdate = req.body;
  const cart = await cartModel.findById(cartID);
  cart.products = cartUpdate;
  await cart.save();

  res.json({ status: "success", cart });
});
// canitdad
router.put("/:cid/product/:pid", async (req, res) => {
  const cartID = req.params.cid;
  const productID = req.params.pid;
  const quantity = req.body.quantity || 1;
  const cart = await cartModel.findById(cartID);

  if (!cart)
    return res.status(404).json({ status: "error", error: "cart not found" });

  const productIDX = cart.products.findIndex((p) => p.id == productID);

  productIDX.quantity = quantity;

  await cart.save();

  res.json({ status: "success", cart });
});

export default router;
