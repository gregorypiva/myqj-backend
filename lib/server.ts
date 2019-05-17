import * as express from 'express';
import * as http from 'http';
import {config, logger} from 'midgar';
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
    this.app.use('/public', express.static(__dirname + '/dist'));
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
      if (e instanceof TypeError) logger.error(e.message);
    }
    const server = http.createServer(this.app);
    server.listen(this.port);
    server.on('error', this.onError);
    server.on('listening', () => {
      var addr = server.address();
      var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      logger.info('Listening on ' + bind);
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
        logger.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(bind + ' is already in use');
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

  static createErrorResponse = (res: any, status?: string|number, message?: string) => {
    const code = typeof status === 'number'
                  ? status
                  : httpStatus[status] || httpStatus.INTERNAL_SERVER_ERROR;

    const response = config.app.mode === 'development'
                      ? message || httpStatus[`${code}_MESSAGE`]
                      : (config as any).errorResponse[code] || httpStatus[`${code}_MESSAGE`];

    return res.status(code).json(response);
  }
}

export {Server}
