import {Server, logger} from 'midgar';
import {motifService} from 'services/motifService';

const getAll = async (req: any, res: any) => {
  try {
    const response = await motifService.getAll();
    return Server.createSuccessResponse(res, response);
  } catch(e) {
    logger.error(JSON.stringify(e), 'controllers/motifs/getAll');
    return Server.createErrorResponse(res, 'BAD_REQUEST', e);
  }
}

export const motif = {
  getAll
}