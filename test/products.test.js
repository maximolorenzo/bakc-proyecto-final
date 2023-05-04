import mongoose from "mongoose";
import chai from "chai";
import Product from "../src/dao/mongo/products.mongo.js";

mongoose.connect("mongodb://127.0.0.1:27017/testeandoProduct");
const expect = chai.expect;

describe("Testing Products de DAO", () => {
  before(function () {
    this.productsDao = new Product();
  });

  beforeEach(function () {
    mongoose.connection.collections.products.drop();
    this.timeout(5000);
  });

  it("El DAO tiene que obtener todos los productos en formato de arreglo", async function () {
    const result = await this.productsDao.get();
    expect(result).to.be.an("array");
  });

  it("El DAO tiene que obtener los productos con paginación, utilizando las opciones que se mandan por parámetros", async function () {
    const result = await this.productsDao.getPaginate(
      { category: "nose" },
      { limit: 5, page: 2, sort: {}, lean: true }
    );
    expect(result.docs).to.be.an("array");
    expect(result.limit).to.be.eql(5);
    expect(result.page).to.be.eql(2);
  });

  it("El DAO tiene que poder crear un nuevo producto", async function () {
    const product = {
      title: "Jordan 1 low dior",
      description: "nike jordan low",
      code: "Testing pa ",
      price: 1300,
      category: "no se",
      thumbnail: [],
      stock: 10,
    };

    const result = await this.productsDao.create(product);
    expect(result._id).to.be.ok;
  });

  it("El DAO tiene que poder obtener un solo producto mediante el ID", async function () {
    const data = {
      title: "Jordan 1 low dior",
      description: "nike jordan low",
      code: "Testing pa ",
      price: 1300,
      category: "no se",
      thumbnail: [],
      stock: 10,
    };

    const product = await this.productsDao.create(data);
    const result = await this.productsDao.getByID(product._id);

    expect(result).to.be.ok.and.an("object");
    expect(result._id).to.be.ok;
  });

  it("El DAO tiene que poder modificar un producto", async function () {
    const data = {
      title: "Jordan 1 low dior",
      description: "nike jordan low",
      code: "Testing pa ",
      price: 1300,
      category: "no se",
      thumbnail: [],
      stock: 10,
    };

    const newData = {
      title: "Producto actualizado",
      stock: 15,
    };

    const product = await this.productsDao.create(data);
    const result = await this.productsDao.update(product._id, newData);
    const updatedProduct = await this.productsDao.getByID(product._id);

    expect(result.modifiedCount).to.be.eql(1);
    expect(updatedProduct.title).to.be.eql(newData.title);
    expect(updatedProduct.stock).to.be.eql(newData.stock);
  });

  it("El DAO tiene que poder eliminar un producto", async function () {
    const data = {
      title: "Jordan 1 low dior",
      description: "nike jordan low",
      code: "Testing pa ",
      price: 1300,
      category: "no se",
      thumbnail: [],
      stock: 10,
    };

    const product = await this.productsDao.create(data);
    const result = await this.productsDao.delete(product._id);
    const deleted = await this.productsDao.getByID(product._id);

    expect(result.deletedCount).to.be.eql(1);
    expect(deleted).to.be.eql(null);
  });
});
