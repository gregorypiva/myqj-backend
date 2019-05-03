const api = require('express').Router();
import {auth} from 'midgar';
import {ticket} from 'src/controllers/ticket';

api.post('/login', auth.login);
api.post('/register', auth.register);
api.post('/ticket/generate', ticket.generate);
api.get('/ticket/get', ticket.get);
api.get('/ticket/getAll', ticket.getAll);

module.exports = api;