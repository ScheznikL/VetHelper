const jwt = require("jsonwebtoken");
const { getOwnerByEmail } = require("../models/owners");

const { SECRET, protect } = require("../utils/protected-route");

jest.mock("jsonwebtoken");
jest.mock("../models/owners");

describe("protect", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should set req.user and call next if token is valid and user exists", async () => {
    const mockToken = "mockToken";
    const mockDecodedToken = { email: "test@example.com", type: "owner" };
    const mockOwner = { id: 1, email: "test@example.com", type: "owner" };

    req.headers.authorization = `Bearer ${mockToken}`;
    jwt.verify.mockReturnValue(mockDecodedToken);
    getOwnerByEmail.mockResolvedValue([mockOwner]);

    await protect(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, SECRET);
    expect(getOwnerByEmail).toHaveBeenCalledWith("test@example.com");
    expect(req.user).toEqual({ ...mockOwner, type: "owner" });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test("should respond with 401 if token is missing", async () => {
    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(getOwnerByEmail).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should respond with 401 if token is invalid", async () => {
    const mockToken = "mockToken";

    req.headers.authorization = `Bearer ${mockToken}`;
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, SECRET);
    expect(getOwnerByEmail).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("should respond with 401 if user does not exist", async () => {
    const mockToken = "mockToken";
    const mockDecodedToken = { email: "test@example.com", type: "owner" };

    req.headers.authorization = `Bearer ${mockToken}`;
    jwt.verify.mockReturnValue(mockDecodedToken);
    getOwnerByEmail.mockResolvedValue([]);

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    expect(jwt.verify).toHaveBeenCalledWith(mockToken, SECRET);
    expect(getOwnerByEmail).toHaveBeenCalledWith("test@example.com");
    expect(next).not.toHaveBeenCalled();
  });
});
