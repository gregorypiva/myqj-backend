const api = require('express').Router();
import {auth} from 'midgar';
import {ticket} from 'src/controllers/ticket';
import {motif} from 'src/controllers/motif';
import {config} from 'src/controllers/config';

api.post('/login', auth.login);
api.post('/register', auth.register);

api.post('/ticket/generate', ticket.generate);
api.get('/ticket/get', ticket.get);
api.post('/ticket/delete', ticket.deleteDemande);
api.get('/ticket/getAll', ticket.getAll);

api.get('/motif/getAll', motif.getAll);

api.get('/config', config);

module.exports = api;