const { handleVeterinarianRegister } = require("../controllers/auth");
const { addVeterinarian } = require("../models/veterinarian");
const jwt = require("jsonwebtoken");

jest.mock("../models/veterinarian", () => ({
  addVeterinarian: jest.fn()
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockToken")
}));

describe("handleVeterinarianRegister", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      query: {
        pib: "John Doe",
        position: "Veterinarian",
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

  test("should respond with status 200 and set the token cookie if registration is successful", async () => {
    addVeterinarian.mockImplementation((email, password, pib, position) => {
      return Promise.resolve();
    });

    await handleVeterinarianRegister(req, res);

    expect(addVeterinarian).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
      "John Doe",
      "Veterinarian"
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { email: "test@example.com", type: "veterinarian" },
      "secretKey"
    );
    expect(res.setHeader).toHaveBeenCalledWith("Set-Cookie", [
      "token=mockToken; HttpOnly; Path=/; Max-Age=3600; Secure=True;"
    ]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.end).toHaveBeenCalled();
  });

  test("should respond with status 500 if there is an error during registration", async () => {
    const errorMessage = "Registration error";
    addVeterinarian.mockImplementation((email, password, pib, position) => {
      return Promise.reject(new Error(errorMessage));
    });

    await handleVeterinarianRegister(req, res);

    expect(addVeterinarian).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
      "John Doe",
      "Veterinarian"
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.end).toHaveBeenCalled();
  });
});
