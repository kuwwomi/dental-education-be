const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
const AppError = require("../error/AppError");
async function authMiddleware(req, res, next) {
  try {
    const tokenHeader = req.headers["x-access-token"];
    if (!tokenHeader) {
      throw new Error("Token missing from headers");
    }

    const tokenParts = tokenHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      throw new Error("Invalid token format");
    }

    const token = tokenParts[1];

    if (!process.env.JWT_PRIVATE_KEY) {
      throw new Error(
        "JWT_PRIVATE_KEY is not set in the environment variables"
      );
    }

    const result = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    req.user = { email: result.email, id: result.id };
    next();
  } catch (err) {
    // Detailed logging for debugging purposes
    console.error("Auth Middleware Error:", err.message);
    next(new AppError(err.message, 403));
  }
}

module.exports = authMiddleware;
