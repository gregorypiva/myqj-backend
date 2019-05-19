import {logger, Database} from 'midgar';

const generate = async (req: any): Promise<any> => {

  logger.debug(`Appel de l'api : /api/ticket/generate (-) 
    ${JSON.stringify(req.body.demande)}`);

  if (isNaN(req.body.demande.motif)) {
    return Promise.reject({message: 'Erreur lors de la création du ticket.'});
  }
  const date = new Date();
  const time = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${req.body.demande.time}:00`;
  try {
    let numticket: any = await Database.select(
      `SELECT SUBSTRING(dem_numticket, 2, 4) as id FROM demande
        WHERE dem_id_patient = ? 
          AND dem_numticket IS NOT NULL
            ORDER BY dem_numticket DESC 
              LIMIT 1`,
    [
      req.body.user.id
    ]);
    // On converti le motif en lettre de A à F
    let idMotif = req.body.demande.motif + 9;
    idMotif = idMotif.toString(16).toUpperCase();

    // On vérifie si il existe un numéro de ticket pour ce patient
    // S oui last + 1, sinon départ à 100
    numticket = numticket[0].id.length > 0 ? Number(numticket[0].id)+1 : '100';

    // On produit le ticket de type [A-F]{1}[0-9]{3}
    req.body.demande.numticket = idMotif + numticket;

    const response = await Database.insert(
      `INSERT INTO demande
        (dem_id_patient, dem_id_motif, dem_numticket)
        VALUES (?, ?, ?)
      `,
    [
      req.body.user.id,
      req.body.demande.motif,
      req.body.demande.numticket
    ]);
    return Promise.resolve(response);
  } catch(e) {
    return Promise.reject({message: e});
  }
}

const deleteDemande = async (req: any, userId: number): Promise<any> => {

  logger.debug(`Appel de l'api : /api/ticket/delete (-) 
    ${JSON.stringify(req.body.demande)}`);

  if (isNaN(req.body.idDemande)) return Promise.reject({message: 'Erreur lors de la demande d\'annulation.'}) 
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
    return Promise.reject({message: e});
  }
}

const get = async (id: number, userId: number): Promise<any> => {

  logger.debug(`Appel de l'api : /api/ticket/get (-) 
    ${id}, ${userId}`);

  if (!id) return Promise.reject({message: 'Aucun numéro de ticket'});

  try {
    const response = await Database.select(`
    SELECT dem_id_demande, dem_id_motif, dem_numticket, dem_date, dem_tempsattente_estime, dem_tempsattente_reel,
    IF(DATE(dem_date) < CURDATE(), 'E', dem_statut) as dem_statut,
    motifs.*
    FROM demande, motifs
      WHERE dem_id_patient = ?
      AND dem_id_demande = ?
      AND dem_id_motif = mot_id_motif
      AND dem_statut != 'D' LIMIT 1
    `, [userId, id]);
    if (response.length > 0) return Promise.resolve(response);
    else return Promise.reject({code: 404, message: 'Le ticket demandé n\'éxiste pas.'});
  } catch(e) {
    return Promise.reject({code: 500, message: e});
  }
}

const getAll = async (userId: number): Promise<any> => {

  logger.debug(`Appel de l'api : /api/ticket/getAll (-) ${userId}`);

  try {
    const response = await Database.select(`
      SELECT dem_id_demande, dem_id_motif, dem_numticket, dem_date, dem_tempsattente_estime, dem_tempsattente_reel,
      IF(DATE(dem_date) < CURDATE(), 'E', dem_statut) as dem_statut
      FROM demande
      WHERE dem_id_patient = 1
          AND dem_statut != 'D'
    `, [userId]);
    return Promise.resolve(response);
  } catch(e) {
    return Promise.reject({code: 500, message: e});
  }
}

export const ticketService = {
  generate,
  get,
  deleteDemande,
  getAll
}