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
  try {
    const response = await Database.select(`
    SELECT * FROM demande, motifs
      WHERE dem_id_patient = ?
      AND dem_id_demande = ?
      AND dem_id_motif = mot_id_motif LIMIT 1
    `, [0, id]);
    if (response.length > 0) return Promise.resolve(response);
    else return Promise.reject('Le ticket demandé n\'éxiste pas.');
  } catch(e) {
    return Promise.reject(e);
  }
}

const getAll = async (): Promise<any> => {
  try {
    const response = await Database.select(`
      SELECT * FROM demande
        WHERE dem_id_patient = ?`
      ,[0]
    );
    return Promise.resolve(response);
  } catch(e) {
    return Promise.reject(e);
  }
}

export const ticketService = {
  generate,
  get,
  getAll
}