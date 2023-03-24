import ProductDTO from "../dao/dto/products.dto.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  get = async () => {
    return await this.dao.get();
  };

  getPaginate = async (search, options) => {
    return await this.dao.getPaginate(search, options);
  };

  create = async (data) => {
    const dataToInsert = new ProductDTO(data);

    return await this.dao.create(dataToInsert);
  };
}
