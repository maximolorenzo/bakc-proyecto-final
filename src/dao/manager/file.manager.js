import fs from "fs";

class FileMaganer {
  constructor(path) {
    this.path = path;
  }

  read = () => {
    if (fs.existsSync(this.path)) {
      return fs.promises
        .readFile(this.path, "utf-8")
        .then((r) => JSON.parse(r));
    }
    return [];
  };

  getNextId = (list) => {
    const count = list.length;
    return count > 0 ? list[count - 1].id + 1 : 1;
  };

  write = (list) => {
    return fs.promises.writeFile(this.path, JSON.stringify(list));
  };

  get = async () => {
    const data = await this.read();

    return data;
  };

  getID = async (id) => {
    const data = await this.read();

    return data.find((p) => p.id == id);
  };

  add = async (obj) => {
    const list = await this.read();
    const nextID = this.getNextId(list);
    obj.id = nextID;

    list.push(obj);

    await this.write(list);

    return obj;
  };

  update = async (id, obj) => {
    obj.id = id;
    const list = await this.read();
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        list[i] = obj;
        break;
      }
    }
    await this.write(list);
  };

  async deleteProduct(idDelete) {
    let pdelete = await this.get();
    let existe = pdelete.some((e) => e.id == idDelete);
    if (!existe) {
      console.log(" No se borro nada ");
    } else {
      pdelete = pdelete.filter((e) => e.id != idDelete);
    }

    await this.write(pdelete);
  }
}

export default FileMaganer;
