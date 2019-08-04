import { Runner } from "./Runner";
import { IFunctions } from "../Interfaces";

export class Functions<Chain> implements IFunctions<Chain> {
  constructor(private runner: Runner, private middleware: Chain) {}

  body(): this {
    this.runner.setReqType("body");
    return this;
  }

  params(): this {
    this.runner.setReqType("params");
    return this;
  }

  isBoolean(value?: RegExp): Chain {
    const test = (field: any): boolean => typeof field === "boolean";
    this.runner.addValidation(test, "is not a boolean");
    return this.middleware;
  }

  isString(value?: RegExp): Chain {
    const validChars = value ? value : /^[A-Za-z0-9_\-@.,()\s]*$/;
    const test = (field: any): boolean => typeof field === "string" && field.length !== 0 && new RegExp(validChars).test(field);
    this.runner.addValidation(test, "is not a string or not a valid string format");
    return this.middleware;
  }

  isAddress(value?: RegExp): Chain {
    const validChars = value ? value : /^[a-zA-Z0-9-#_\-.,()@\s]*$/;
    const test = (field: any): boolean => typeof field === "string" && field.length !== 0 && new RegExp(validChars).test(field);
    this.runner.addValidation(test, "is not a valid address format");
    return this.middleware;
  }

  minLength(value: number): Chain {
    const test = (field: any): boolean => field.length >= value;
    this.runner.addValidation(test, `must have a length of ${value}`);
    return this.middleware;
  }

  maxLength(value: number): Chain {
    const test = (field: any): boolean => field.length <= value;
    this.runner.addValidation(test, `must be ${value} in length or fewer`);
    return this.middleware;
  }

  isDate(): Chain {
    const test = (field: any): boolean => {
      const date = new Date(field);
      return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime());
    };
    this.runner.addValidation(test, `must be valid date format`);
    return this.middleware;
  }

  isEmail(): Chain {
    const validChars = /^[a-zA-Z0-9_.-]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const test = (field: any): boolean => typeof field === "string" && field.length !== 0 && new RegExp(validChars).test(field);
    this.runner.addValidation(test, "is not a valid email");
    return this.middleware;
  }

  isPassword(): Chain {
    const validChars = /((?=.*\d)(?=.*[A-Z])(?=.*\W))/;
    const test = (field: any): boolean => typeof field === "string" && field.length !== 0 && new RegExp(validChars).test(field);
    this.runner.addValidation(test, "is not a valid password");
    return this.middleware;
  }
}
