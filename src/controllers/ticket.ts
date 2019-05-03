const httpStatus = require("http-status");
import {Server, logger} from 'midgar';
import {ticketService} from 'services/ticketService';

const generate = async (req: any, res: any, next: any) => {
  try {
    const response = await ticketService.generate(req.body);
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, httpStatus.BAD_REQUEST, e);
  }
}

const get = async (req: any, res: any, next: any) => {
  try {
    const response = await ticketService.get(req.query.id);
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, httpStatus.BAD_REQUEST, e);
  }
}

const getAll = async (req: any, res: any, next: any) => {
  try {
    const response = await ticketService.getAll();
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, httpStatus.BAD_REQUEST, e);
  }
}

export const ticket = {
  generate,
  get,
  getAll
}