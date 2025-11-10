const User = require("../../src/models/User");
const Post = require("../../src/models/Post");

describe("Models", () => {
  describe("User Model", () => {
    it("should create a user with valid data", () => {
      const userData = {
        username: "testuser",
        password: "password123",
      };

      // Mock mongoose model creation
      const mockUser = new User(userData);
      expect(mockUser.username).toBe(userData.username);
      expect(mockUser.password).toBe(userData.password);
    });

    it("should require username", () => {
      const userData = {
        password: "password123",
      };

      expect(() => {
        const mockUser = new User(userData);
        // In a real scenario, this would be validated by mongoose
        // For unit test, we check the schema definition
        expect(mockUser.schema.paths.username.options.required).toBe(true);
      }).not.toThrow();
    });

    it("should require password", () => {
      const userData = {
        username: "testuser",
      };

      expect(() => {
        const mockUser = new User(userData);
        expect(mockUser.schema.paths.password.options.required).toBe(true);
      }).not.toThrow();
    });
  });

  describe("Post Model", () => {
    it("should create a post with valid data", () => {
      const postData = {
        title: "Test Post",
        content: "Test content",
        author: "507f1f77bcf86cd799439011", // Mock ObjectId
        slug: "test-post",
      };

      const mockPost = new Post(postData);
      expect(mockPost.title).toBe(postData.title);
      expect(mockPost.content).toBe(postData.content);
      expect(mockPost.slug).toBe(postData.slug);
    });

    it("should require title", () => {
      const postData = {
        content: "Test content",
        author: "507f1f77bcf86cd799439011",
        slug: "test-post",
      };

      expect(() => {
        const mockPost = new Post(postData);
        expect(mockPost.schema.paths.title.options.required).toBe(true);
      }).not.toThrow();
    });

    it("should require content", () => {
      const postData = {
        title: "Test Post",
        author: "507f1f77bcf86cd799439011",
        slug: "test-post",
      };

      expect(() => {
        const mockPost = new Post(postData);
        expect(mockPost.schema.paths.content.options.required).toBe(true);
      }).not.toThrow();
    });

    it("should require author", () => {
      const postData = {
        title: "Test Post",
        content: "Test content",
        slug: "test-post",
      };

      expect(() => {
        const mockPost = new Post(postData);
        expect(mockPost.schema.paths.author.options.required).toBe(true);
      }).not.toThrow();
    });

    it("should require slug", () => {
      const postData = {
        title: "Test Post",
        content: "Test content",
        author: "507f1f77bcf86cd799439011",
      };

      expect(() => {
        const mockPost = new Post(postData);
        expect(mockPost.schema.paths.slug.options.required).toBe(true);
      }).not.toThrow();
    });

    it("should have default createdAt", () => {
      const postData = {
        title: "Test Post",
        content: "Test content",
        author: "507f1f77bcf86cd799439011",
        slug: "test-post",
      };

      const mockPost = new Post(postData);
      expect(mockPost.createdAt).toBeDefined();
    });
  });
});
