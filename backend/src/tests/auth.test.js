import request from "supertest";
import app from "../app.js";
import { connectTestDB, closeTestDB } from "./setup.js";

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("AUTH ROUTES", () => {
  test("POST /auth/register - should create a user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "test@mail.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  test("POST /auth/login - should login successfully", async () => {
    // primero registramos
    await request(app)
      .post("/auth/register")
      .send({ email: "login@mail.com", password: "123456" });

    // login real
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "login@mail.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
