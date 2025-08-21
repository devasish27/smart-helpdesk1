import request from "supertest";
import app from "../index.js";

describe("KB API", () => {
  it("should search KB", async () => {
    const res = await request(app).get("/api/kb?query=test");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});