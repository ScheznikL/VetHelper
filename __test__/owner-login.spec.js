const { handleOwnerLogin } = require("../controllers/auth");
const { getOwnerByCredentials } = require("../models/owners");
const jwt = require("jsonwebtoken");

jest.mock("../models/owners", () => ({
  getOwnerByCredentials: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockToken")
}));

describe("handleOwnerLogin", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      query: {
        email: "test@example.com",
        password: "password123"
      }
    };
    res = {
      setHeader: jest.fn(() => res),
      status: jest.fn(() => res),
      end: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should respond with status 200 and set the token cookie if credentials are valid", async () => {
    const mockUser = { email: "test@example.com", password: "password123" };
    getOwnerByCredentials.mockResolvedValue(mockUser);

    await handleOwnerLogin(req, res);

    expect(getOwnerByCredentials).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { email: "test@example.com", type: "owner" },
      "secretKey"
    );
    expect(res.setHeader).toHaveBeenCalledWith("Set-Cookie", [
      "token=mockToken; HttpOnly; Path=/; Max-Age=3600; Secure=True;"
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });

  test("should respond with status 401 if credentials are invalid", async () => {
    getOwnerByCredentials.mockResolvedValue(null);

    await handleOwnerLogin(req, res);

    expect(getOwnerByCredentials).toHaveBeenCalledWith(
      "test@example.com",
      "password123"
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.end).toHaveBeenCalled();
  });
});
