const jwt = require("jsonwebtoken");
import {config, logger} from 'midgar';

// Create a token from a payload.
const createToken = (payload: object) => {
  const jwtConfig = {expiresIn: config.jwt.expiresIn};
  return jwt.sign(payload, config.jwt.secretKey, jwtConfig);
}

// Verify the token.
const verifyToken = (token: string) => {
  logger.info('test token :' + token);
  jwt.verify(token, config.jwt.secretKey, (e: any, decoded: any) => {
    logger.error(e);
    if (e) throw new Error(`${e.name}: ${e.message}`);
    else {
      logger.info(decoded);
      return decoded;
    }
  });
}

// @TODO CR: si c'est un JWT token, tu devrais avoir plus de fonction autour ex: decode token, ...

export const token = {
  createToken,
  verifyToken
}