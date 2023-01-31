import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import productsModel from "./dao/models/products.models.js";
import chatRouter from "./routes/chat.router.js";
import messagesModel from "./dao/models/chat.model.js";
import productsViewsRouter from "./routes/views router/product.views.router.js";

const run = (io, app) => {
  app.use("/products", productsViewsRouter);
  app.use("/api/products", productRouter);
  app.use("/api/carts", cartRouter);
  app.use("/chat", chatRouter);

  io.on("connection", async (socket) => {
    console.log("New cliente connected");

    const products = await productsModel.find().lean().exec();
    io.emit("socket01", products);

    socket.on("message", async (data) => {
      await messagesModel.create(data);
      const messages = await messagesModel.find().lean().exec();
      io.emit("logs", messages);
    });

    socket.on("deleteProduct", async (data) => {
      const value = await data;
      console.log(value);
      await productsModel.deleteOne({ _id: value });
    });
  });
};

export default run;
