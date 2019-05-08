import * as express from 'express';
import * as path from 'path';
import * as http from 'http';
const bodyParser = require('body-parser');
const httpStatus = require("http-status");

class Server {
  app: any;
  port: string;

  constructor(port?: string) {
    this.port = port || '3000';
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.set('port', this.port);
    this.app.get('/', (req: any, res: any) => res.sendFile(__dirname + "/dist/index.html"));
  }

  // /**
  //  * Create HTTP server.
  //  */
  run() {
    try{
      require('src/routes')(this.app);
    } catch (e) {
      if (e instanceof TypeError) console.log(e);
    }
    const server = http.createServer(this.app);
    server.listen(this.port);
    server.on('error', this.onError);
    server.on('listening', () => {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      console.log('Listening on ' + bind);
    });
  }

  appUse(middleware: any) {
    this.app.use(middleware);
  }

  onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    var bind = typeof this.port === 'string'
      ? 'Pipe ' + this.port
      : 'Port ' + this.port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  static createSuccessResponse = (res: any, body: any, status?: any, message?: any) => {
    status = status || httpStatus.OK;
    message = message || httpStatus["200_MESSAGE"];
    return res.status(status).json(body);
  }

  static createErrorResponse = (res: any, status?: any, message?: any) => {
    status = httpStatus[status] || httpStatus.INTERNAL_SERVER_ERROR;
    message = message || 'Une erreur technique s\'est produite';
    return res.status(status).json(message);
  }
}

export {Server}
