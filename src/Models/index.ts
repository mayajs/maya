import { PaginateModel, Document } from "mongoose";

interface IPaginateModel {
  [k: string]: PaginateModel<any>;
}

const models: IPaginateModel[] = [];

export class Models {
  static addModel(model: IPaginateModel): void {
    models.push(model);
  }

  instance<T extends Document>(name: string): PaginateModel<T> {
    return models.filter(e => e[name])[0][name];
  }
}
