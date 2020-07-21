<p align="center"><img src="https://github.com/mayajs/maya/blob/master/maya.svg"></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@mayajs/core"><img src="https://img.shields.io/npm/v/@mayajs/core.svg?style=for-the-badge&logo=appveyor" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@mayajs/core"><img src="https://img.shields.io/npm/dm/@mayajs/core.svg?style=for-the-badge&logo=appveyor" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@mayajs/core"><img src="https://img.shields.io/npm/l/@mayajs/core?style=for-the-badge&logo=appveyor" alt="License"></a>
  <a href="https://github.com/microsoft/typescript-tslint-plugin"><img src="https://img.shields.io/badge/code%20style-standard-blue.svg?style=for-the-badge&logo=appveyor" alt="Code Style"></a>
</p>

A simple Node.js Framework for creating REST API server-side-applications. MayaJS is designed for simplicity and ease of use for beginners. MayaJS is built using Typescript to take advantage of strongly type checking for easy code troubleshooting in development. MayaJS uses express under the hood for routing and middlewares. MayaJS hides any boiler plate code that are hard to setup for begginers when creating any nodejs server applications. Controllers, Models and Services are the key features of MayaJS. Developers are no longer to write complicated code MayaJS will do it for them. Validation of request is builtin on MayaJS without any third party library. We are trying to make MayaJS as simple as possible for every type developer.

# Installation

- Run `npm i @mayajs/cli -g` to install MayaJS globally in your local machine.

# Quick Start

- Run `maya new <name-of-project>` e.i. `maya new my-new-app`.
- Run `cd <name-of-project>` to go inside the your project folder.
- Run `maya serve` or `maya s` to start your MayaJS project.

> In case where port number is already in use or you want to run it on a different port number, use `--port` to specify a different port.

# Files

- [Index](#index)
- [App](#app)
- [Routing](#routing)
- [Controller](#controller)
- [Model](#model)
- [Services](#service)

## Index

> Root file of the server. Acts as a bootstrapper for all the routes and models. Accepts `AppModule` that contains all the settings for the server. This also start the server on the defined port number. If there are no port number define it will run on port `3333`.

```javascript
import { AppModule } from "./app.module";
import { MayaJS } from "@mayajs/core";

const server = new MayaJS(AppModule);
const prod = process.env.NODE_ENV === "production";
server.prodMode(prod).start();
```

## App

> This is where you define all the necessary settings for your server. This will also configure your routes and middleware on runtime. Middlewares that are define on the configRoutes function will be applied on all controllers defined in the controllers array.

```javascript
import { App } from "@mayajs/core";
import { Mongo } from "@mayajs/mongo";
import { routes } from "./app.routing.module";

@App({
  cors: true, // Sets the CORS options
  logs: "dev", // Sets the logger mode DEFAULT is dev
  databases: [
    // You can add multiple database in this array
    Mongo({ connectionString: "your-connection-string-here" }),
  ],
  port: 3333, // Sets the port number of your nodejs server
  routes, // Define your routes here
})
export class AppModule {}
```

## Routing

> This module handles all the routes for our server. You can define a path for your controllers. You can also add middlewares for your route to use. These middlewares will be executed first before your controller.

```javascript
import { SampleController } from "./controllers/sample/sample.controller";

export const routes = [
  {
    controllers: [SampleController], // Add your controllers for this route
    middlewares: [], // Define custom middlewares here
    path: "", // Path name of this route
  },
];
```

## Controller

> Handles all the request. You can define specific middleware or validation here using the METHOD DECORATOR functions. Method decorators are special functions that inject informationt to declaritively specify what type of route is being decorated.

To create a controller all you need to do is to run `maya g conroller [name-of-controller]` or `maya g c [name-of-controller]` via Mayajs CLI. A sample code below shows what you can do inside the controller. You can add `Get, Patch, Post, Delete and Put` request using decorators with the same name.

```javascript
import { Get, Patch, Post, Delete, Put } from "@mayajs/common";
import { Request, Response, NextFunction } from "express";
import { SampleServices } from "./sample.service";
import { Controller } from "@mayajs/core";

@Controller({
  model: "./sample.model",
  route: "/sample",
})
export class SampleController {
  // Inject SampleServices
  constructor(private services: SampleServices) {}

  // This is a GET request equal to "/sample"
  @Get({ path: "/", middlewares: [] })
  get(req: Request, res: Response, next: NextFunction): void {
    // Use a function on SampleService
    this.services.getSamples();

    // Do some GET stuff here
    res.send("This is a GET request");
  }

  // This is a GET request equal to "/sample/:id"
  @Get({ path: "/:id", middlewares: [] })
  getId(req: Request, res: Response, next: NextFunction): void {
    // Do some GET stuff here
    res.send("This is a GET with id request");
  }

  // This is a POST request equal to "/sample/:id/:name"
  @Post({ path: "/:id/:name", middlewares: [] })
  post(req: Request, res: Response, next: NextFunction): void {
    // Do some POST stuff here
    res.send("This is a POST request");
  }

  // This is a PATCH request equal to "/sample/:id/custom-path"
  @Patch({ path: "/:id/custom-path", middlewares: [] })
  patch(req: Request, res: Response, next: NextFunction): void {
    // Do some PATCH stuff here
    res.send("This is a PATCH request");
  }

  // This is a PUT request equal to "/sample/:id"
  @Put({ path: "/:id", middlewares: [] })
  put(req: Request, res: Response, next: NextFunction): void {
    // Do some PUT stuff here
    res.send("This is a PUT request");
  }

  // This is a DELETE request equal to "/sample/:id"
  @Delete({ path: "/:id", middlewares: [] })
  delete(req: Request, res: Response, next: NextFunction): void {
    // Do some DELETE stuff here
    res.send("This is a DELETE request");
  }
}

```

## Model

> This is a moongoose model that the controller will use to mapped the data to be save or modified from a database.

To create a model all you need to do is to run `maya g model [name-of-model]` or `maya g m [name-of-model]` via Mayajs CLI. You can create a Schema using `MongoSchema` and a Model using `MongoModel` from `@mayajs/mongo`. Below shows a basic code example inside a model fiel.

```javascript
import { MongoSchema, MongoModel } from "@mayajs/mongo";

const schema = MongoSchema({
  name: {
    required: [true, "Name is required."],
    type: String,
    unique: true,
  },
});

export default MongoModel("Sample", schema);
```

> **NOTE: sample.model.ts** must be on the same folder of the **controller.ts** that is referencing it.
> **sample.model.ts** must be exported as **default** too.

## Service

To create a service all you need to do is to run `maya g service [name-of-service]` or `maya g s [name-of-service]` via Mayajs CLI. Services can be injected inside of a controller or another service. This will make your code more reusable and shareable across your code base. Below shows a basic code example inside a sevice fiel.

```javascript
import { Injectable } from "@mayajs/core";

@Injectable() // This decorator allows this class to be injected on other modules
export class SampleServices {
  getSamples() {
    // Your business logic here
  }
}
```

> **NOTE: Services** must have an **Injectable Decorator** for it to be used on any controller or other services.

## Collaborating

See collaborating guides [here.](https://github.com/mayajs/maya/blob/master/COLLABORATOR_GUIDE.md)

## People

Author and maintainer [Mac Ignacio](https://github.com/Mackignacio)

## License

[MIT](https://github.com/mayajs/maya/blob/master/LICENSE)
