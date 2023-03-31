import { Router } from "express";
import TicketModel from "../dao/mongo/models/ticket.model.js";
import { CartService, ProductService } from "../repository/index.js";
import { v4 as uuidv4 } from "uuid";
import { authorization, passportCall } from "../utils.js";
import CustomError from "../services/errors/custom_error.js";
import generateCartErrorInfo from "../services/errors/info.js";
import EError from "../services/errors/enums.js";

const router = Router();
//muestra los carritos
router.get("/", async (req, res) => {
  const carts = await CartService.get();
  res.json({ carts });
});

//crea el carrito
router.post("/", async (req, res) => {
  const cartNew = await CartService.create({});

  res.json({ status: "success", cartNew });
});
//trae el carrito por id
router.get("/:cid", async (req, res) => {
  const id = req.params.cid;
  const carts = await CartService.getByIdLean(id);
  res.render("cart", { data: carts });
});

//agrega un producto al carrito
router.post("/:cid/product/:pid", authorization("user"), async (req, res) => {
  const cartID = req.params.cid;
  const productID = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const cart = await CartService.getById(cartID);
    const infoProduct = await ProductService.getById(productID);
    if (infoProduct.stock < quantity) {
      await CustomError.createError({
        name: "add product error",
        cause: generateCartErrorInfo(infoProduct),
        message: "Error dont have Stock",
        code: EError.INVALID_TYPES_ERROR,
      });
    }

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
  } catch (error) {
    console.log(error);
  }

  res.json({ status: "success", cart });
});
//elemina un producto del carrito
router.delete("/:cid/product/:pid", authorization("user"), async (req, res) => {
  const cartID = req.params.cid;
  const productID = req.params.pid;
  const quantity = req.body.quantity || 1;
  const cart = await CartService.getById(cartID);

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
  const cart = await CartService.findById(cartID);
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
  const cart = await CartService.findById(cartID);
  cart.products = cartUpdate;
  await cart.save();

  res.json({ status: "success", cart });
});
// canitdad
router.put("/:cid/product/:pid", async (req, res) => {
  const cartID = req.params.cid;
  const productID = req.params.pid;
  const quantity = req.body.quantity || 1;
  const cart = await CartService.findById(cartID);

  if (!cart)
    return res.status(404).json({ status: "error", error: "cart not found" });

  const productIDX = cart.products.findIndex((p) => p.id == productID);

  productIDX.quantity = quantity;

  await cart.save();

  res.json({ status: "success", cart });
});

router.post(
  "/:cid/purchase",
  passportCall("jwt"),
  authorization("user"),
  async (req, res) => {
    const cartID = req.params.cid;
    const cart = await CartService.getById(cartID);
    let totalPrice = 0;
    const noStock = [];
    const comparation = cart.products;
    await Promise.all(
      comparation.map(async (p) => {
        if (p.id.stock >= p.quantity) {
          p.id.stock -= p.quantity;
          ProductService.update(p.id._id, p.id);
          totalPrice += p.id.price * p.quantity;
          const productIDX = comparation.findIndex(
            (item) => item.id._id == p.id._id
          );
          comparation.splice(productIDX, 1);
          await cart.save();
        } else {
          noStock.push({
            title: p.id.title,
            price: p.id.price,
            quantity: p.quantity,
          });
        }
      })
    );
    if (totalPrice > 0)
      await TicketModel.create({
        purchaser: req.user.user.email,
        amount: totalPrice,
        code: uuidv4(),
      });
    res.json({ status: "Success" });
  }
);

export default router;
