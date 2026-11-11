const request = require("supertest");
const app = require("../app");

describe("GET /health", () => {
  it("returns 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
    expect(res.body).toHaveProperty("timestamp");
  });
});

describe("GET /metrics", () => {
  it("returns HTML page with metrics", async () => {
    const res = await request(app).get("/metrics");
    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toContain("Метрики сервера");
  });
});

describe("GET /unknown-route", () => {
  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/this-does-not-exist");
    expect(res.statusCode).toBe(404);
  });
});
