# Mayajs

## Description
A Node.js framework with Angular inspired development for REST API server-side-applications. This is built on top of Express using Typescript to take advantage of strongly type checking and modern Javascript features. Typescript also provides easy implementation Dependency Injection and Inversion of Control (IOC) that makes unit testing much easier.

## Features 

- Decorators for Get, Post, Patch, Put and Delete methods
- Single class for mongoose models
- Controller and Injectable decorator for Dependency Injection
- Middleware functions for chained validation of request body

## Installation

- Open command line terminal ( cmd or shell).
- Run `npm i @mayajs/core` to install all dependency.

## Quick Start

Two easy steps to develop a node.js server with typescript.

### Step 1 : Create necessary files

#### index.ts
> Coming soon!!!

#### app.module.ts
> Coming soon!!!

#### controller.ts
```javascript
import { Controller, Get, Patch, Post, Delete } from "@mayajs/core";
import { NextFunction, Request, Response } from "express";

@Controller({
  model: "sample.model", // Name of the model for this controller
  route: "/sample", // This route is equal to "/sample"
})
export class SampleController {

  // This is GET request equal to "/sample"
  @Get({ path: "/", validations: [] })
  get(req: Request, res: Response, next: NextFunction){
      // Do some GET stuff here
  }
  
  // This is GET request equal to "/sample/:id"
  @Get({ path: "/:id", validations: [] })
  get(req: Request, res: Response, next: NextFunction){
      // Do some GET stuff here
  }

  // This is POST request equal to "/sample/:id/:name"
  @Post({ path: "/:id/:name", validations: [] })
  get(req: Request, res: Response, next: NextFunction){
      // Do some POST stuff here
  }

  // This is PATCH request equal to "/sample/:id/custom-path"
  @Patch({ path: "/:id/custom-path", validations: [] })
  get(req: Request, res: Response, next: NextFunction){
      // Do some PATCH stuff here
  }

  // This is PUT request equal to "/sample/:id"
  @Put({ path: "/:id", validations: [] })
  get(req: Request, res: Response, next: NextFunction){
      // Do some PUT stuff here
  }

  // This is DELETE request equal to "/sample/:id"
  @Delete({ path: "/:id", validations: [] })
  get(req: Request, res: Response, next: NextFunction){
      // Do some DELETE stuff here
  }
}
```
> **NOTE: sample.model.ts** must be on the same folder of the **controller.ts** that is referencing it. 
> **sample.model.ts** must be exported as **default** too.

### Step 2 : Run your app
- Open command line terminal ( cmd or shell).
- Run `npm start` to start nodejs sever.

## Sample Project
> Coming soon!!!

## CLI
> Coming soon!!!

## Contribute
> Coming soon!!!

## Test
> Coming soon!!!

## Become a supporter
> Coming soon!!!
