import { MayaJS } from "../src";

test("should output an object", () => {
  const server = new MayaJS({
    cors: true,
    logs: "prod",
    port: 3333,
    routes: [],
  });
  expect(typeof server).toBe("object");
  const prod = process.env.NODE_ENV === "production";
  expect(typeof server.prodMode(prod)).toBe("object");
});
