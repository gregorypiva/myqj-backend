const api = require('express').Router();
import {auth} from 'midgar';
import {ticket} from 'src/controllers/ticket';
import {motif} from 'src/controllers/motif';

api.post('/login', auth.login);
api.post('/register', auth.register);

api.post('/ticket/generate', ticket.generate);
api.get('/ticket/get', ticket.get);
api.get('/ticket/getAll', ticket.getAll);

api.get('/motif/getAll', motif.getAll);

module.exports = api;