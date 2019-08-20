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
import { AppModule } from "./app.module";
import { MayaJS } from "@mayajs/core";

const server = new MayaJS(AppModule);
server.start(); // Start the server
```

#### app.module.ts

```javascript
import { SampleController } from "./controllers/sample/sample.controllers";
import { App } from "@mayajs/core";

@App({
  cors: true,
  logs: true,
  mongoConnection: {
    connectionString: process.env.MONGO_CONNECTION_URL,
    options: { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false },
  },
  port: 3333,
  routes: [
    {
      callback: (req: Request, res: Response) => {
        // This function will be called last in the sequence
        // You can put some response logic here like sanitizing the response and etc.
      },
      controllers: [SampleController],
      middlewares: [], // Put express middlewares here for this whole route
      path: "",
    },
  ],
})
export class AppModule {}
```

#### controller.ts

```javascript
import { Controller, Get, Patch, Post, Delete } from "@mayajs/core";
import { NextFunction, Request, Response } from "express";
import { SampleServices } from "./sample.service";

@Controller({

  // Path to model
  model: "./sample.model",

  // <main-route> is the **path** on the routes option in AppModule
  // This route is equal to "<domain>/<main-route>/sample"
  route: "/sample",
})
export class SampleController {

  // Inject SampleServices to services variable
  constructor(private services: SampleServices) {}

  // This is a GET request equal to "<domain>/<main-route>/sample"
  @Get({
    path: "/",
    middlewares: [
       // Put express middlewares here for this specific route
    ]
  })
  get(req: Request, res: Response, next: NextFunction): void {
    // Do some GET stuff here
  }

  // This is a GET request equal to "<domain>/<main-route>/sample/:id"
  @Get({
    path: "/:id",
    middlewares: [
       // Put express middlewares here for this specific route
    ]
  })
  getId(req: Request, res: Response, next: NextFunction): void {
    // Do some GET stuff here
  }

  // This is a POST request equal to "<domain>/<main-route>/sample/:id/:name"
  // This route has validations using Check
  @Post({
    path: "/:id/:name",
    middlewares: [
       // Put express middlewares here for this specific route
    ]
  })
  post(req: Request, res: Response, next: NextFunction): void {
    // Do some POST stuff here
  }

  // This is a PATCH request equal to "<domain>/<main-route>/sample/:id/custom-path"
  @Patch({
    path: "/:id/custom-path",
    middlewares: [
       // Put express middlewares here for this specific route
    ]
  })
  patch(req: Request, res: Response, next: NextFunction): void {
    // Do some PATCH stuff here
  }

  // This is a PUT request equal to "<domain>/<main-route>/sample/:id"
  @Put({
    path: "/:id",
    middlewares: [
       // Put express middlewares here for this specific route
    ]
  })
  put(req: Request, res: Response, next: NextFunction): void {
    // Do some PUT stuff here
  }

  // This is a DELETE request equal to "<domain>/<main-route>/sample/:id"
  @Delete({
    path: "/:id",
    middlewares: [
       // Put express middlewares here for this specific route
    ]
  })
  delete(req: Request, res: Response, next: NextFunction): void {
    // Do some DELETE stuff here
  }
}
```

#### sample.model.ts

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
import { Injectable, Models } from "@mayajs/core";

@Injectable() // This decorator allows this class to be injected on other modules
export class SampleServices {
  @Models("sample") model: any; // Create an instance of `sample` model
}
```

> **NOTE: Services** must have an **Injectable Decorator** for it to be used on any controller or other services.

If you don't want to create these files there is a [sample project here](https://github.com/Mackignacio/maya-sample.git) that you can clone or download. This sample project is up to date with the latest version of mayajs.

How to clone repository

- Open command line terminal ( cmd or shell).
- Run `git clone https://github.com/mayajs/maya.git`.
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
