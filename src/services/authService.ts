import {Database, token, logger} from 'midgar';

// Check if the user exists in database (matching username and password) which we'll say is good enough to be authenticated.
const authenticate = async (username: string, password: string): Promise<string|boolean> => {
  if(!username || !password) return Promise.reject({code: 400, message: `Invalid login request. Must contain a valid username and password.`});
  try {
    const response = await Database.select(`
    SELECT idt_id_patient FROM identifiants
      WHERE idt_connexion = ?
        AND idt_password = ?
  `, [username, password]);
  if(response.length > 0) return Promise.resolve(token.createToken({id: response[0].idt_id_patient, username, password}));
  else return Promise.reject({code: 400, message: 'Username or password incorrect'});
  } catch (e) {
    logger.error(e, 'AuthService/authenticate');
    return Promise.reject({code: 500});
  }
}

const register = async (args: any): Promise<string|boolean> => {
  const { username, password } = args;
  const regexUsername = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!username || !password) return Promise.reject({code: 400, message: `Invalid register request. Must contain a valid username and password.`});
  if(!regexUsername.test(username)) return Promise.reject({code: 400, message: `Invalid register request. Invalid username.`});
  if (password.length < 8) return Promise.reject({code: 400, message: `Invalid register request. Password must contain more than 8 characters.`});
  try {
    const exist = await Database.select(`SELECT idt_id_patient FROM identifiants WHERE idt_connexion = ?`, [username]);
    if (exist.length > 0) return Promise.reject({code: 400, message: `User ${username} already exists.`});
    const valueIdentifiant = await Database.insert(
      `INSERT INTO identifiants
        (idt_connexion, idt_password)
        VALUES (?, ?)
      `,
    [
      username,
      password
    ])
    if(!valueIdentifiant) return Promise.reject({code: 500});

    const valuePatient = await Database.insert(
      `INSERT INTO patient
        (
          pat_id_patient,
          pat_nom,
          pat_prenom,
          pat_ddn,
          pat_sexe,
          pat_taille,
          pat_poids,
          pat_adr_1,
          pat_codpos,
          pat_ville,
          pat_pays,
          pat_telpor
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    [
      (valueIdentifiant as any).insertId,
      args.lastname,
      args.firstname,
      `${args.year}-${args.month}-${args.day}`,
      args.sexe,
      args.size,
      args.poids,
      args.adress,
      args.cp,
      args.city,
      args.country,
      args.phone
    ])
    
    if(!valuePatient) {
      return Promise.reject({code: 500});
    }
    return Promise.resolve(token.createToken({id: (valueIdentifiant as any).insertId, username, password}));

  } catch (e) {
    logger.error(JSON.stringify(e), 'AuthService/register');
    return Promise.reject({code: 500});
  }
}

export const authService ={
  authenticate,
  register
};