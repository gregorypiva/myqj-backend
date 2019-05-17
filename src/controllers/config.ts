import {Server, config} from 'midgar';

const getConfig = async (req: any, res: any, next: any) => {
  return Server.createSuccessResponse(res, config.app);
}

export {getConfig as config}
