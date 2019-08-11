import { Controller, Delete, Get, Patch, Post, Put } from "@mayajs/core";
import { Request, Response, NextFunction } from "express";

@Controller({
  model: "sample.model",
  route: "/sample",
})
export class SampleController {
  // This is a GET request equal to "/sample"
  @Get({ path: "/", validations: [] })
  get(req: Request, res: Response, next: NextFunction): void {
    // Do some GET stuff here
    res.send("This is a GET request");
  }

  // This is a GET request equal to "/sample/:id"
  @Get({ path: "/:id", validations: [] })
  getId(req: Request, res: Response, next: NextFunction): void {
    // Do some GET stuff here
    res.send("This is a GET with id request");
  }

  // This is a POST request equal to "/sample/:id/:name"
  @Post({ path: "/:id/:name", validations: [] })
  post(req: Request, res: Response, next: NextFunction): void {
    // Do some POST stuff here
    res.send("This is a POST request");
  }

  // This is a PATCH request equal to "/sample/:id/custom-path"
  @Patch({ path: "/:id/custom-path", validations: [] })
  patch(req: Request, res: Response, next: NextFunction): void {
    // Do some PATCH stuff here
    res.send("This is a PATCH request");
  }

  // This is a PUT request equal to "/sample/:id"
  @Put({ path: "/:id", validations: [] })
  put(req: Request, res: Response, next: NextFunction): void {
    // Do some PUT stuff here
    res.send("This is a PUT request");
  }

  // This is a DELETE request equal to "/sample/:id"
  @Delete({ path: "/:id", validations: [] })
  delete(req: Request, res: Response, next: NextFunction): void {
    // Do some DELETE stuff here
    res.send("This is a DELETE request");
  }
}
