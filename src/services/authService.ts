import {Database, token} from 'midgar';

// // Check if the user exists in database (matching username and password) which we'll say is good enough to be authenticated.
const authenticate = async (username: string, password: string): Promise<string|boolean> => {
  if(!username || !password) return Promise.reject(`Invalid login request. Must contain a valid username and password.`);
  try {
    const response = await Database.select(`
    SELECT idt_id_patient FROM identifiants
      WHERE idt_connexion = ?
        AND idt_password = ?
  `, [username, password]);
  if(response.length > 0) return Promise.resolve(token.createToken({username, password}));
  else return Promise.reject('Username or password incorrect');
  } catch (e) {
    return Promise.reject(e);
  }
}

const register = async (args: any): Promise<string|boolean> => {
  const {
    username,
    password
  } = args;

  if(!username || !password) return Promise.reject(`Invalid register request. Must contain a valid username and password.`);

  try {
    const exist = await Database.select(`SELECT idt_id_patient FROM identifiants WHERE idt_connexion = ?`, [username]);
    if (exist.length > 0) return Promise.reject(`User ${username} already exists.`);
    const value = await Database.insert(
      `INSERT INTO identifiants
        (idt_connexion, idt_password)
        VALUES (?, ?)
      `,
    [
      username,
      password
    ])
    if(value) return Promise.resolve(token.createToken({username, password}));
  } catch (e) {
    Promise.reject(e);
  }
}

export const authService ={
  authenticate,
  register
};