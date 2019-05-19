export const config = {
  app: {
    name: 'MyQJ',
    version: '1.1.2',
    mode: 'production',
  },
  log: {
    level: 0,
    type: "console",
    dir: "./logs/",
    name: "log-server"
  },
  database: {
    development: {
      host      : "localhost",
      user      : "root",
      password  : "",
      database  : "myqj"
    },
    production: {
      host      : "localhost",
      user      : "client",
      password  : "",
      database  : "larimar",
      socketPath: "/var/run/mysqld/mysqld.sock"
    }
  },
  jwt: {
    secretKey: "123456789",
    expiresIn: "1h"
  },
  publicUrl: [
    '/public/*',
    '/api/login',
    '/api/register',
    '/api/config'
  ],
  errorResponse: {
    500: 'Une erreur technique s\'est produite.',
    404: 'Erreur lors du chargement, veuillez réessayer',
    401: 'Invalid authentication header.',
  }
}
