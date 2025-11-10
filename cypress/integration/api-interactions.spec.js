describe("API Interactions", () => {
  it("should fetch hello message from API", () => {
    cy.request("/api/hello").then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("message", "Hello, world!");
    });
  });

  it("should handle login API calls", () => {
    cy.request({
      method: "POST",
      url: "/api/login",
      body: {
        username: "testuser",
        password: "password",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("message", "Login successful");
    });
  });

  it("should handle invalid login attempts", () => {
    cy.request({
      method: "POST",
      url: "/api/login",
      body: {
        username: "testuser",
        password: "wrongpassword",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property("message", "Invalid credentials");
    });
  });

  it("should handle contact form submissions", () => {
    cy.request({
      method: "POST",
      url: "/api/contact",
      body: {
        name: "Test User",
        email: "test@example.com",
        message: "Test message",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property(
        "message",
        "Form submitted successfully"
      );
    });
  });

  it("should validate contact form data", () => {
    cy.request({
      method: "POST",
      url: "/api/contact",
      body: {
        name: "",
        email: "test@example.com",
        message: "Test message",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property(
        "message",
        "All fields are required"
      );
    });
  });
});
