import request from "supertest";
import app from "../index.js";

describe("Ticket API", () => {
  let ticketId;

  it("should create a ticket", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .send({ title: "Billing issue", description: "Need invoice" });
    expect(res.statusCode).toBe(201);
    ticketId = res.body._id;
  });

  it("should run triage", async () => {
    const res = await request(app).post(`/api/triage/${ticketId}/triage`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("category");
  });
});