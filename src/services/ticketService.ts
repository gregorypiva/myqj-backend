import {logger, Database, token} from 'midgar';

interface Ticket {
  motif: number;
  time: number;
  type: string;
}

const generate = async (req: any, userId: number): Promise<any> => {
  logger.debug(`Appel de l'api : /api/ticket/generate (-) 
    ${JSON.stringify(req.body.demande)}`);
  if (isNaN(req.body.demande.motif)) return Promise.reject('Erreur lors de la création du ticket.') 
  const date = new Date();
  const time = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${req.body.demande.time}:00`;
  try {
    const response = await Database.insert(
      `INSERT INTO demande
        (dem_id_patient, dem_id_motif)
        VALUES (?, ?)
      `,
    [
      userId,
      req.body.demande.motif
    ])
    return Promise.resolve(response);
  } catch(e) {
    return Promise.reject(e);
  }
}

const deleteDemande = async (req: any, userId: number): Promise<any> => {
  logger.debug(`Appel de l'api : /api/ticket/delete (-) 
    ${JSON.stringify(req.body.demande)}`);
  if (isNaN(req.body.idDemande)) return Promise.reject('Erreur lors de la demande d\'annulation.') 
  try {
    const response = await Database.update(
      `UPDATE demande
        SET dem_statut = 'D'
        WHERE dem_id_patient = ?
          AND dem_id_demande = ?
      `,
    [
      userId,
      req.body.idDemande
    ])
    return Promise.resolve(response);
  } catch(e) {
    return Promise.reject(e);
  }
}

const get = async (id: number, userId: number): Promise<any> => {
  if (!id) return Promise.reject('Aucun numéro de ticket');
  try {
    const response = await Database.select(`
    SELECT * FROM demande, motifs
      WHERE dem_id_patient = ?
      AND dem_id_demande = ?
      AND dem_id_motif = mot_id_motif
      AND dem_statut != 'D' LIMIT 1
    `, [userId, id]);
    console.log(userId, id)
    if (response.length > 0) return Promise.resolve(response);
    else return Promise.reject('Le ticket demandé n\'éxiste pas.');
  } catch(e) {
    return Promise.reject(e);
  }
}

const getAll = async (userId: number): Promise<any> => {
  try {
    const valide = await Database.select(`
      SELECT * FROM demande
        WHERE dem_id_patient = ?
          AND date(dem_date) < CURDATE()
          AND dem_statut != 'D'`
      ,[userId]
    );
    const waiting = await Database.select(`
      SELECT * FROM demande
        WHERE dem_id_patient = ?
        AND date(dem_date) = CURDATE()
        AND dem_statut != 'D'`
      ,[userId]
    );
    return Promise.resolve({waiting, valide});
  } catch(e) {
    return Promise.reject(e);
  }
}

export const ticketService = {
  generate,
  get,
  deleteDemande,
  getAll
}