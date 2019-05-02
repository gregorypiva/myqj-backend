import {Server, auth} from 'midgar';

const server = new Server();
server.appUse(auth.required);
server.run();