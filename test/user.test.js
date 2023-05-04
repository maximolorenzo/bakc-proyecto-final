import mongoose from "mongoose";
import chai from "chai";
import User from "../src/dao/mongo/users.mongo.js";

mongoose.connect("mongodb://127.0.0.1:27017/testeandoUsers");
const expect = chai.expect;

describe("Testing Users DAO", () => {
  before(function () {
    this.usersDao = new User();
  });

  beforeEach(function () {
    mongoose.connection.collections.users.drop();
    this.timeout(5000);
  });

  it("El DAO tiene que poder obtener los usuarios en formato de arreglo", async function () {
    const result = await this.usersDao.get();
    expect(result).to.be.an("array");
  });

  it("El DAO tiene que agregar un usuario correctamente a la base de datos", async function () {
    const mockUser = {
      first_name: "Maximo ",
      last_name: "Lorenzo",
      email: "maximolorenzo@gmail.com",
      age: "27",
      password: "secret",
      role: "User",
    };

    const result = await this.usersDao.create(mockUser);

    expect(result._id).to.be.ok;
  });

  it("El DAO tiene que poder obtener un solo usuario por medio del ID o del Email", async function () {
    const mockUser = {
      first_name: "Maximo ",
      last_name: "Lorenzo",
      email: "maximolorenzo@gmail.com",
      age: "27",
      password: "secret",
      role: "User",
    };

    const user = await this.usersDao.create(mockUser);

    const result = await this.usersDao.getByID(user._id);
    const result2 = await this.usersDao.getByEmail(user.email);

    expect(result).to.be.ok.and.an("object");
    expect(result2).to.be.ok.and.an("object");
  });

  expect(updatedUser.first_name).to.be.eql(data.first_name);
  expect(updatedUser.password).to.be.eql(data.password);
});
