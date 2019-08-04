import { Request } from "express";

export class Runner {
  private reqType: "body" | "params";
  private validations: any[] = [];

  constructor(private field: string) {
    this.reqType = "body";
  }

  setField(value: string): this {
    this.field = value;
    return this;
  }

  setReqType(value: "body" | "params"): this {
    this.reqType = value;
    return this;
  }

  addValidation(method: Function, message: string): void {
    this.validations.push({ method, message });
  }

  run(req: Request): { status: boolean; message?: string } {
    let error: Array<string | undefined> = [];
    if (this.validations.length > 0) {
      error = this.validations
        .map(validation => {
          if (!validation.method(req[this.reqType][this.field])) {
            return `${this.field} ${validation.message}`;
          }
        })
        .filter(e => typeof e !== "undefined");
    }
    return error.length > 0 ? { status: true, message: error.join(", ") } : { status: false, message: "" };
  }
}
