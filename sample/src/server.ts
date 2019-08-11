import { Express } from "express";
import maya from "../../src";

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
      controllers: [],
      middlewares: [],
      route: "/api/v1",
    });

    this.app.use(route, middlewares, router);
  }
}

export default new Server();
