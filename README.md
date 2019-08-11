# Mayajs

## Description

A Node.js framework with Angular inspired development for REST API server-side-applications. This is built on top of Express using Typescript to take advantage of strongly type checking and modern Javascript features. Typescript also provides easy implementation Dependency Injection and Inversion of Control (IOC) that makes unit testing much easier.

## Features

- **Method Decorators** for Get, Post, Patch, Put and Delete methods
- Single class for mongoose models
- **Controller and Injectable decorators** for Dependency Injection
- Chained validation of request body

## Installation

- Open command line terminal ( cmd or shell).
- Run `npm i @mayajs/core` to install.

## Quick Start

Two easy steps to develop a node.js server with typescript.

### Step 1 : Create necessary files

#### index.ts

```javascript
import { Express, Request, Response } from "express";
import server from "./app.module";
import http from "http";

class Maya {
  constructor(private app: Express) {
    this.unhandleErrors(app);
  }

  start(port?: number | string): void {
    port = this.normalizePort(port || 3333);
    const server = http.createServer(this.app);
    server.listen(port, this.onListen(port));
  }

  normalizePort(val: any): number {
    const port = parseInt(val, 10);
    return isNaN(port) ? val : port;
  }

  onListen(port: any): () => void {
    return () => console.log("\x1b[32mListening on port:", `\x1b[36m${port}\x1b[0m`);
  }

  unhandleErrors(app: Express): void {
    app.use((req: Request, res: Response) => {
      if (!req.route) {
        const url = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        res.status(405).json({ status: "Invalid Request", message: `Request: (${req.method}) ${url} is invalid!` });
      }
    });
  }
}

const app = new Maya(server.app);
app.start(process.env.PORT);
```

#### app.module.ts

```javascript
import { SampleController } from "./controllers/sample.controllers";
import { Express } from "express";
import maya from "@mayajs/core";

class AppModule {
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

export default new AppModule();
```

#### controller.ts

```javascript
import { Controller, Get, Patch, Post, Delete } from "@mayajs/core";
import { NextFunction, Request, Response } from "express";

@Controller({
  model: "sample.model", // Name of the model for this controller
  route: "/sample", // This route is equal to "/sample"
})
export class SampleController {
  // This is a GET request equal to "/sample"
  @Get({ path: "/", validations: [] })
  get(req: Request, res: Response, next: NextFunction): void {
    // Do some GET stuff here
  }

  // This is a GET request equal to "/sample/:id"
  @Get({ path: "/:id", validations: [] })
  getId(req: Request, res: Response, next: NextFunction): void {
    // Do some GET stuff here
  }

  // This is a POST request equal to "/sample/:id/:name"
  @Post({ path: "/:id/:name", validations: [] })
  post(req: Request, res: Response, next: NextFunction): void {
    // Do some POST stuff here
  }

  // This is a PATCH request equal to "/sample/:id/custom-path"
  @Patch({ path: "/:id/custom-path", validations: [] })
  patch(req: Request, res: Response, next: NextFunction): void {
    // Do some PATCH stuff here
  }

  // This is a PUT request equal to "/sample/:id"
  @Put({ path: "/:id", validations: [] })
  put(req: Request, res: Response, next: NextFunction): void {
    // Do some PUT stuff here
  }

  // This is a DELETE request equal to "/sample/:id"
  @Delete({ path: "/:id", validations: [] })
  delete(req: Request, res: Response, next: NextFunction): void {
    // Do some DELETE stuff here
  }
}
```

> **NOTE: sample.model.ts** must be on the same folder of the **controller.ts** that is referencing it.
> **sample.model.ts** must be exported as **default** too.

If you don't want to create these files there is a [sample project here](https://github.com/Mackignacio/maya-sample.git) that you can clone or download. This sample project is up to date with the latest version of mayajs.

How to clone repository

- Open command line terminal ( cmd or shell).
- Run `git clone https://github.com/Mackignacio/maya-sample.git`.
- Run `npm i` to install all dependency.

### Step 2 : Run your app

- Open command line terminal ( cmd or shell).
- Run `npm start` to start nodejs sever.

## Test

> Coming soon!!!

## CLI

> Coming soon!!!

## Contribute

> Coming soon!!!

## Become a supporter

> Coming soon!!!
