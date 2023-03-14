import ProductService from "../services/product.service.js";

const producServices = new ProductService();

//get
export const getAll = async (req, res) => {
  const products = await productsModel.find().lean().exec();
  res.render("index", { products: products });
};

export const getRTP = async (req, res) => {
  res.render("realTimeProducts", { script: "index.js" });
};

export const create = async (req, res) => {
  const product = req.body;

  const productAdd = await productsModel.create(product);

  res.render("realTimeProducts", { script: "index.js" });
};

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
export const updateProduct = async (req, res) => {
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
};

export const getById = async (req, res) => {
  const id = req.params.pid;
  const showProduct = await productsModel.findOne({ _id: id }).lean().exec();
  res.render("products", { showProduct });
};
