export const config = {
  log: {
    level: 2,
    type: "console",
    dir: "./logs/",
    name: "log-server"
  },
  database: {
    development: {
      host      : "localhost",
      user      : "root",
      password  : "",
      database  : "larimar"
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
    '/api/login',
    '/api/register'
  ]
}
