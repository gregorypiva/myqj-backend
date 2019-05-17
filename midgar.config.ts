export const config = {
  app: {
    name: 'MyQJ',
    version: '1.1.2',
    mode: 'development',
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
    400: 'test response 400',
    401: 'test response 401',
  }
}
