<p align="center"><img src="https://github.com/mayajs/maya/blob/master/maya.svg"></p>

## Description
A simple Node.js Framework for creating REST API server-side-applications. This is built on top of Express using Typescript to take advantage of strongly type checking and modern Javascript features. It also provides easy implementation Dependency Injection and Inversion of Control (IOC) that makes unit testing much easier. MayaJS is built with simplicity in mind and ease of use. 

## CLI

- Open command line terminal ( cmd or shell).
- Run `npm i @mayajs/cli -g` to install mayajs globally in your local machine.

## Quick Start

- Open command line terminal ( cmd or shell).
- Run `maya new <name-of-project>` Example: `maya new my-new-project`.
- Run `cd <name-of-project>` to go inside the your project folder.
- Run `npm start` to start nodejs server.

## Features

#### index.ts

> Root file of the server. Acts as a bootstrapper for all the routes and models. Accepts `AppModule` that contains all the settings for the server. This also start the server on the defined port number. If there are no port number define it will run on port `3333`.

```javascript
import { AppModule } from "./app.module";
import { MayaJS } from "@mayajs/core";

const server = new MayaJS(AppModule);
const prod = process.env.NODE_ENV === "production";
server.prodMode(prod).start();
```

#### app.module.ts

> This is where you define all the necessary settings for your server. This will also configure your routes and middleware on runtime. Middlewares that are define on the configRoutes function will be applied on all controllers defined in the controllers array.

```javascript
import { App } from "@mayajs/core";
import { Mongo } from "@mayajs/mongo";
import { routes } from "./app.routing.module";

@App({
  cors: true,
  logs: "dev",
  database: Mongo({
    connectionString: "your-connection-string-here",
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    },
  }),
  port: 3333,
  routes,
})
export class AppModule {}
```

#### app.routing.module

> This module handles all the routes for our server. You can define a path for your controllers. You can also add middlewares for your route to use. These middlewares will be executed first before your controller. 

```javascript
import { SampleController } from "./controllers/sample/sample.controller";

export const routes = [
  {
    controllers: [SampleController],
    middlewares: [],
    path: "",
  },
];
```

#### controller.ts

> Handles all the request. You can define specific middleware or validation here using the METHOD DECORATOR functions. Method decorators are special functions that inject informationt to declaritively specify what type of route is being decorated.

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

#### model.ts

> This is a moongoose model that the controller will use to mapped the data to be save or modified from a database.

```javascript
import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate";

const schema = new Schema({
  name: {
    required: [true, "Name is required."],
    type: String,
    unique: true,
  },
});

schema.plugin(paginate);

export default model("Sample", schema);
```

> **NOTE: sample.model.ts** must be on the same folder of the **controller.ts** that is referencing it.
> **sample.model.ts** must be exported as **default** too.

#### sample.service.ts

```javascript
import { Injectable } from "@mayajs/core";
import { Models } from "@mayajs/mongo";

@Injectable() // This decorator allows this class to be injected on other modules
export class SampleServices {
  @Models("sample") model: any; // Create an instance of `sample` model

  getSamples() {
    // Your business logic here
  }
}
```

> **NOTE: Services** must have an **Injectable Decorator** for it to be used on any controller or other services.

## Dependency

- Open command line terminal ( cmd or shell).
- Run `npm i` to install all dependency.

## Run server

- Open command line terminal ( cmd or shell).
- Run `npm start` to install all dependency.

## Contributor

> [Mark Anthony C. Ignacio](https://github.com/Mackignacio)

## Become a supporter

> Coming soon!!!
