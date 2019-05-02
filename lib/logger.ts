"use strict";

import * as fs from 'fs';
import {Console} from 'console';
import {config} from 'midgar';

const error = (message: string, filename: string = 'None', code: string = 'None'): void => {
  send('ERROR', {message, filename, code});
}

const warn = (message: string, filename: string = 'None', code: string = 'None'): void => {
  if (config.log.level < 1) return;
  send('WARN', {message, filename, code});
}

const debug = (message: string, filename: string = 'None', code: string = 'None'): void => {
  if (config.log.level < 2) return;
  send('DEBUG', {message, filename, code});
}

const info = (message: string, filename: string = 'None', code: string = 'None'): void => {
  if (config.log.level < 3) return;
  send('INFO', {message, filename, code});
}

const write = async (message: string, filename:string) => {
  try {
    await getDirectory();
    const stdout = fs.createWriteStream(`${config.log.dir}${filename}.log`, {flags: 'a'});
    const logger = new Console({ stdout });
    logger.log(message);
  } catch (e) {
    throw `Error name=Midgar.logger type=function(write) name=createDirectory : ${e}`;    
  }
}

const send = (mode: string, args: object): void => {
  if (config.log.type === 'console') console.log(`${mode} (-) ${(args as any).filename} (-) ${(args as any).code} : ${(args as any).message}`);
  else if (config.log.type === 'file') sendFile(mode, args);
}

const sendFile = async (mode: string, args: object) => {
  try {
    await getDirectory();
    const stdout = fs.createWriteStream(`${config.log.dir}${config.log.name}.log`, {flags: 'a'});
    const logger = new Console({ stdout });
    const date = new Date();
    logger.log(`${date.toLocaleDateString('fr-FR')} - ${mode} (-) ${(args as any).filename} (-) ${(args as any).code} : ${(args as any).message} \r\n`);
  } catch (e) {
    console.error(e);
  }
}

const getDirectory = async (): Promise<boolean> => {
  try {
    await fs.promises.readdir(config.log.dir);
    return Promise.resolve(true);
  } catch(e) {
    if(e.code === 'ENOENT') createDirectory();
    else return Promise.reject(e);
  }
}

const createDirectory = async (): Promise<void> => {
  try {
    await fs.promises.mkdir(config.log.dir, { recursive: true });
  } catch(e) {
    throw `Error name=Midgar.logger type=function name=createDirectory : ${e}`;
  }
}

export const logger = {
  error,
  warn,
  debug,
  info,
  write
}