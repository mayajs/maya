import { Get, Post, Put, Patch, Delete } from "../../src/lib/Methods";
import "reflect-metadata";

test("should output MethodDecorator", () => {
  const method = Get({ path: "test" });
  expect(typeof method).toBe("function");

  const factory = method({}, "test", {});
  expect(typeof factory).toBe("undefined");
});

test("should output MethodDecorator", () => {
  const method = Post({ path: "test" });
  expect(typeof method).toBe("function");

  const factory = method({}, "test", {});
  expect(typeof factory).toBe("undefined");
});

test("should output MethodDecorator", () => {
  const method = Put({ path: "test" });
  expect(typeof method).toBe("function");

  const factory = method({}, "test", {});
  expect(typeof factory).toBe("undefined");
});

test("should output MethodDecorator", () => {
  const method = Patch({ path: "test" });
  expect(typeof method).toBe("function");

  const factory = method({}, "test", {});
  expect(typeof factory).toBe("undefined");
});

test("should output MethodDecorator", () => {
  const method = Delete({ path: "test" });
  expect(typeof method).toBe("function");

  const factory = method({}, "test", {});
  expect(typeof factory).toBe("undefined");
});
