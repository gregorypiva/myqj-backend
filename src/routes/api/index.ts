const api = require('express').Router();
import {auth} from 'midgar';

api.post('/login', auth.login);
api.post('/register', auth.register);

module.exports = api;