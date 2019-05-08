import {logger, Database} from 'midgar';

const getAll = async (): Promise<any> => {
  try {
    const response = await Database.select(`
      SELECT * FROM motifs WHERE mot_actif = 1`);
    return Promise.resolve(response);
  } catch(e) {
    return Promise.reject(e);
  }
}

export const motifService = {
  getAll
}