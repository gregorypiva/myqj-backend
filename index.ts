import {Server, authProtect} from 'midgar';

const server = new Server();
server.appUse(authProtect.intercept);
server.run();