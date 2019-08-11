import { Express } from "express";
import maya from "@mayajs/core";
import { SampleController } from "./controllers/sample.controllers";

class Server {
  maya: maya;

  constructor() {
    this.maya = new maya();
    this.configRoutes();
  }

  get app(): Express {
    return this.maya.app;
  }

  configRoutes(): void {
    const { route, middlewares, router } = this.maya.routes({
      controllers: [SampleController],
      middlewares: [],
      route: "",
    });

    this.app.use(route, middlewares, router);
  }
}

export default new Server();
