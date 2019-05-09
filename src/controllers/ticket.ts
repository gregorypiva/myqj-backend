const httpStatus = require("http-status");
import {Server, logger, token} from 'midgar';
import {ticketService} from 'services/ticketService';

const generate = async (req: any, res: any, next: any) => {
  try {
    const user = token.verifyToken(req);
    const response = await ticketService.generate(req, user.id);
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, 'BAD_REQUEST', e);
  }
}

const get = async (req: any, res: any, next: any) => {
  try {
    const user = token.verifyToken(req);
    const response = await ticketService.get(req.query.id, user.id);
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, 'BAD_REQUEST', e);
  }
}

const deleteDemande = async (req: any, res: any, next: any) => {
  try {
    const user = token.verifyToken(req);
    const response = await ticketService.deleteDemande(req, user.id);
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, 'BAD_REQUEST', e);
  }
}

const getAll = async (req: any, res: any, next: any) => {
  try {
    const user = token.verifyToken(req);
    const response = await ticketService.getAll(user.id);
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, 'BAD_REQUEST', e);
  }
}

export const ticket = {
  generate,
  get,
  deleteDemande,
  getAll
}