import {logger, Database} from 'midgar';

interface Ticket {
  motif: number;
  time: number;
  type: string;
}

const generate = async (demande: Ticket): Promise<any> => {
  logger.debug(`Appel de l'api : /api/ticket/generate (-) 
    ${JSON.stringify(demande)}`);
  if (isNaN(demande.motif)) return Promise.reject('Erreur lors de la création du ticket.') 
  const date = new Date();
  const time = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${demande.time}:00`;
  try {
    const response = await Database.insert(
      `INSERT INTO demande
        (dem_id_patient, dem_id_motif)
        VALUES (?, ?)
      `,
    [
      0,
      demande.motif
    ])
    return Promise.resolve(response);
  } catch(e) {
    return Promise.reject(e);
  }
}

const get = async (id: number): Promise<any> => {
  return Promise.resolve(id);
}

const getAll = async (): Promise<any> => {
  return Promise.resolve('id');
}

export const ticketService = {
  generate,
  get,
  getAll
}