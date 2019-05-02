const httpStatus = require("http-status");
import {Server, token, config} from 'midgar';

const authConfig = config.publicUrl;

function isAuthHeaderInvalid(req: any) {
  const authHeader = req.headers.authorization;
  return !authHeader || authHeader.split(" ")[0] !== "Bearer";
}

const intercept = (req: any, res: any, next: any) => {
  if (authConfig.includes(req.url)) {
    next();
    return;
  }
  if (isAuthHeaderInvalid(req)) {
    return Server.createErrorResponse(res, httpStatus.UNAUTHORIZED, `Error in authorization format. Invalid authentication header. ${httpStatus["401_MESSAGE"]}`);
  }
  try {
    // @TODO CR: split will be in error if headers contains 1 or no element. #Out of memory
    token.verifyToken(req.headers.authorization.split(" ")[1]);
    next();
  } catch (err) {
    return Server.createErrorResponse(res, httpStatus.UNAUTHORIZED, `Invalid token. ${httpStatus["401_MESSAGE"]}`);
  }
  next();
}

export const authProtect = {intercept}