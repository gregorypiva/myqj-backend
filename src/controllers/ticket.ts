import {Server, logger} from 'midgar';
import {ticketService} from 'services/ticketService';

const generate = async (req: any, res: any) => {
  try {
    const response = await ticketService.generate(req);
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, e.code, e.message);
  }
}

const get = async (req: any, res: any) => {
  try {
    const response = await ticketService.get(req.query.id, req.body.user.id);
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, e.code, e.message);
  }
}

const deleteDemande = async (req: any, res: any) => {
  try {
    const response = await ticketService.deleteDemande(req, req.body.user.id);
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, e.code, e.message);
  }
}

const getAll = async (req: any, res: any) => {
  try {
    const response = await ticketService.getAll(req.body.user.id);
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(e);
    return Server.createErrorResponse(res, e.code, e.message);
  }
}

export const ticket = {
  generate,
  get,
  deleteDemande,
  getAll
}