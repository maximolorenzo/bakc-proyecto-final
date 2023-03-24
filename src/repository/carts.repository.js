import CartDTO from "../dao/dto/carts.dto.js";

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  get = async () => {
    return await this.dao.get();
  };

  create = async (data) => {
    const dataToInsert = new CartDTO(data);

    return await this.dao.add(dataToInsert);
  };
  getById = async (id) => {
    return await this.dao.getById(id);
  };

  getByIdLean = async (id) => {
    return await this.dao.getByIdLean(id);
  };
}
