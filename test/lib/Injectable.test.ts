import { Injectable } from "../../src/di";

test("should output a anonymouse class", () => {
  const injectable = Injectable();
  expect(typeof injectable).toBe("function");
});
