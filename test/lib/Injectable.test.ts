import { Injectable } from "../../src/lib/Injectable";

test("should output a anonymouse class", () => {
  const injectable = Injectable();
  expect(typeof injectable).toBe("function");
});
