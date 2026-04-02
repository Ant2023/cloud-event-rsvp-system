const request = require("supertest");
const app = require("../src/app");

test("App responds (server is up)", async () => {
  const res = await request(app).get("/");
  expect([200, 404]).toContain(res.statusCode);
});
