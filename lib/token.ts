const jwt = require("jsonwebtoken");
import {config} from 'midgar';

// Create a token from a payload.
const createToken = (payload: object) => {
  const jwtConfig = {expiresIn: config.jwt.expiresIn};
  return jwt.sign(payload, config.jwt.secretKey, jwtConfig);
}

// Verify the token.
const verifyToken = (req: any) => {
  let token = req.headers.authorization || req.body.authorization;
  if (token && token.split(" ")[0] === "Bearer") {
    token = token.split(" ")[1];
  } else {
    return false;
  }
  return jwt.verify(token, config.jwt.secretKey, (e: any, decoded: any) => {
    if (e) throw new Error(`${e.name}: ${e.message}`);
    else {
      return decoded;
    }
  });
}

export const token = {
  createToken,
  verifyToken
}