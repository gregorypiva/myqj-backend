const jwt = require("jsonwebtoken");
import {config} from 'midgar';

// Create a token from a payload.
const createToken = (payload: object) => {
  const jwtConfig = {expiresIn: config.jwt.expiresIn};
  return jwt.sign(payload, config.jwt.secretKey, jwtConfig);
}

// Verify the token.
const verifyToken = (token: string) => {
  jwt.verify(token, config.jwt.secretKey, (err: any, decoded: any) => {
    if (err) throw new Error(`${err.name}: ${err.message}`);
    else return decoded;
  });
}

// @TODO CR: si c'est un JWT token, tu devrais avoir plus de fonction autour ex: decode token, ...

export const token = {
  createToken,
  verifyToken
}