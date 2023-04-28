import ProductModel from "./models/products.model.js";
import { generateProductErrorInfo } from "../../services/errors/info.js";
import CustomError from "../../services/errors/custom_error.js";
export default class Product {
  constructor() {}
  create = async (data) => {
    if (!data.title) {
      CustomError.createError({
        name: "Title creation error",
        cause: generateProductErrorInfo(),
        message: "Error trying to create product",
        code: EErros.INVALID_TYPES_ERROR,
      });
    }
    return await ProductModel.create(data);
  };

  get = async () => {
    return await ProductModel.find().lean().exec();
  };

  getPaginate = async (search, options) => {
    return await ProductModel.paginate(search, options);
  };

  create = async (data) => {
    return await ProductModel.create(data);
  };

  getById = async (id) => {
    return await ProductModel.findOne({ _id: id });
  };

  delete = async (id) => {
    return await ProductModel.deleteOne({ _id: id });
  };

  update = async (id, productToUpdate) => {
    return await ProductModel.updateOne({ _id: id }, productToUpdate);
  };
}
