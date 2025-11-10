describe("Error Handling and Edge Cases", () => {
  it("should handle network errors gracefully", () => {
    // Test with invalid API endpoint
    cy.request({
      url: "/api/nonexistent",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.be.oneOf([404, 500]);
    });
  });

  it("should handle malformed JSON in requests", () => {
    cy.request({
      method: "POST",
      url: "/api/contact",
      body: "invalid json",
      headers: {
        "Content-Type": "application/json",
      },
      failOnStatusCode: false,
    }).then((response) => {
      // Should handle malformed JSON appropriately
      expect(response.status).to.be.within(400, 500);
    });
  });

  it("should handle large payloads", () => {
    const largeMessage = "a".repeat(10000); // 10KB string

    cy.request({
      method: "POST",
      url: "/api/contact",
      body: {
        name: "Test User",
        email: "test@example.com",
        message: largeMessage,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("should handle special characters in form data", () => {
    cy.request({
      method: "POST",
      url: "/api/contact",
      body: {
        name: "Test Üser",
        email: "test@example.com",
        message: "Message with special chars: àáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it("should handle concurrent requests", () => {
    // Make multiple concurrent requests
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(cy.request("/api/hello"));
    }

    cy.wrap(Promise.all(requests)).then((responses) => {
      responses.forEach((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
