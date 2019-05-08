import {Server, token, config} from 'midgar';
import {authService} from 'services/authService';

const authConfig: Array<string> = config.publicUrl;

const required = (req: any, res: any, next: any) => {
  // if public url include url called
  if (inPublicUrl(authConfig, req.url)) {
    return next();
  }
  try {
    // if header not include bearer token
    const authentication = token.verifyToken(req);
    if (!authentication) {
      return Server.createErrorResponse(res, 'UNAUTHORIZED', `Error in authorization format. Invalid authentication header.`);
    }
    next();
  } catch (e) {
    if(e.message === "TokenExpiredError: jwt expired") {
      return Server.createErrorResponse(res, 'UNAUTHORIZED', `TOKEN_EXPIRED`);
    }
    return Server.createErrorResponse(res, 'INTERNAL_SERVER_ERROR', `${e}`);
  }
}

const login = async (req: any, res: any, next: any) => {
  try {
    const token = await authService.authenticate(req.body.username, req.body.password);
    return Server.createSuccessResponse(res, {accessToken: token});
  } catch(e) {
    return Server.createErrorResponse(res, e.code, e.message);
  }
}

const register = async (req: any, res: any, next: any) => {
  try {
    const token = await authService.register(req.body);
    return Server.createSuccessResponse(res, {accessToken: token});
  } catch(e) {
    return Server.createErrorResponse(res, e.code, e.message);
  }
}

function inPublicUrl(urls: Array<string>, url: any): boolean {
  return urls.includes(url.replace(/\?.*/, ''));
}

export const auth = {
  required,
  login,
  register
}