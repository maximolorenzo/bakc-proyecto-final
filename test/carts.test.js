import mongoose from "mongoose";
import chai from "chai";
import Cart from "../src/dao/mongo/carts.mongo.js";

mongoose.connect("mongodb://127.0.0.1:27017/testeandoCart");
const expect = chai.expect;

describe("Testing Carts de DAO", () => {
  before(function () {
    this.cartsDao = new Cart();
  });

  beforeEach(function () {
    mongoose.connection.collections.carts.drop();
    this.timeout(5000);
  });

  it("El DAO tiene que poder crear un cart con una propiedad products que por defecto es un array vacío", async function () {
    const cart = await this.cartsDao.create();
    expect(cart._id).to.be.ok;
    expect(cart.products).to.be.deep.equal([]);
  });

  it("El DAO tiene que poder obtener un cart mediante su ID", async function () {
    const cart = await this.cartsDao.create();
    const foundCart = await this.cartsDao.getByID(cart._id);

    console.log(foundCart);

    expect(foundCart._id).to.be.ok;
    expect(foundCart.products).to.be.an("array");
  });

  it("El DAO tiene que poder modificar un cart", async function () {
    const cart = await this.cartsDao.create();
    const data = [
      { product: "63d3df5453af636c753a106a", quantity: 3 },
      { product: "641c61487f90f07c92ba8807", quantity: 1 },
    ];

    const result = await this.cartsDao.update(cart._id, data);

    console.log(result);

    expect(result.modifiedCount).to.be.ok.and.eql(1);
  });
});
