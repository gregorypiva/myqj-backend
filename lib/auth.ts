const httpStatus = require("http-status");
import {Server, token, config} from 'midgar';
import {authService} from 'services/authService';
import { logger } from './logger';

const authConfig = config.publicUrl;

const required = (req: any, res: any, next: any) => {
  if (authConfig.includes(req.url.replace(/\?.*/, ''))) {
    next();
    return;
  }
  if (isAuthHeaderInvalid(req)) {
    return Server.createErrorResponse(res, httpStatus.UNAUTHORIZED, `Error in authorization format. Invalid authentication header.`);
  }
  try {
    // @TODO CR: split will be in error if headers contains 1 or no element. #Out of memory
    token.verifyToken(req.headers.authorization.split(" ")[1]);
    next();
  } catch (e) {
    return Server.createErrorResponse(res, httpStatus.INTERNAL_SERVER_ERROR, `${e} ${httpStatus["500_MESSAGE"]}`);
  }
  next();
}

const login = async (req: any, res: any, next: any) => {
  try {
    const token = await authService.authenticate(req.body.username, req.body.password);
    return Server.createSuccessResponse(res, {accessToken: token});
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, httpStatus.BAD_REQUEST, e);
  }
}

const register = async (req: any, res: any, next: any) => {
  try {
    const token = await authService.register(req.body);
    return Server.createSuccessResponse(res, {accessToken: token});
  } catch(e) {
    return Server.createErrorResponse(res, httpStatus.BAD_REQUEST, e);
  }
}

function isAuthHeaderInvalid(req: any) {
  const authHeader = req.headers.authorization;
  return !authHeader || authHeader.split(" ")[0] !== "Bearer";
}

export const auth = {
  required,
  login,
  register
}