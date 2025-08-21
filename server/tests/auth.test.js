import request from "supertest";
import app from "../index.js"; // your express app

describe("Auth API", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "test@test.com", password: "123456" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login a user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@test.com", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
