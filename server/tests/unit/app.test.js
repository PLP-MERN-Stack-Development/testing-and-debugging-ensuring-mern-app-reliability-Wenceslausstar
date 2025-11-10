const request = require("supertest");
const app = require("../../src/app");

describe("App Routes", () => {
  describe("GET /api/hello", () => {
    it("should return 200 and hello message", async () => {
      const res = await request(app).get("/api/hello");
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Hello, world!");
    });
  });

  describe("POST /api/login", () => {
    it("should return 200 for valid credentials", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ username: "testuser", password: "password" });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
    });

    it("should return 401 for invalid credentials", async () => {
      const res = await request(app)
        .post("/api/login")
        .send({ username: "testuser", password: "wrongpassword" });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /api/contact", () => {
    it("should return 200 for valid form data", async () => {
      const res = await request(app)
        .post("/api/contact")
        .send({
          name: "Test User",
          email: "test@example.com",
          message: "Test message",
        });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Form submitted successfully");
    });

    it("should return 400 if fields are missing", async () => {
      const res = await request(app)
        .post("/api/contact")
        .send({ name: "Test User", email: "test@example.com" });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("All fields are required");
    });

    it("should return 400 for invalid email", async () => {
      const res = await request(app)
        .post("/api/contact")
        .send({
          name: "Test User",
          email: "invalid-email",
          message: "Test message",
        });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid email");
    });
  });
});
