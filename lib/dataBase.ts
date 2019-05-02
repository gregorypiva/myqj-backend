"use strict";

const mysql = require('mysql2/promise');
import {config, logger} from 'midgar';

class Database {

  static async select (sql: string, args?: Array<any>): Promise<Array<any>|string> {
    try {
      const response = await this.query(sql, args);
      return Promise.resolve(response[0]);
    } catch (e) {
      return Promise.reject('at select in database.js: ' + e);
    }
  }

  static async insert (sql: string, args: Array<any>): Promise<boolean> {
    try {
      const response = await this.query(sql, args);
      return Promise.resolve(response && response[0].affectedRows > 0 ? true : false);
    } catch (e) {
      return Promise.reject('at insert in database.js: ' + e);
    }
  }

  static async update (sql: string, args: Array<any>): Promise<number> {
    try {
      const response = await this.query(sql, args);
      return Promise.resolve(response && response[0].affectedRows ? response[0].affectedRows : 0);
    } catch (e) {
      return Promise.reject('at update in database.js: ' + e);
    }
  }

  static async delete (sql: string, args: Array<any>): Promise<number> {
    try {
      const response = await this.query(sql, args);
      return Promise.resolve(response && response[0].affectedRows ? response[0].affectedRows : 0);
    } catch (e) {
      return Promise.reject('at delete in database.js: ' + e);
    }
  }

  static async query (sql: string, args: Array<any> = []): Promise<any> {
    let connection: any;
    const {host, user, database, socketPath} = (config as any).database[process.env.NODE_ENV];
    try {
      connection = await mysql.createConnection({host, user, database, socketPath});
      const results = await connection.query(sql, args);
      logger.info('at query - request : ' + sql + '\r\n Results : ' + JSON.stringify(results[0]), 'database.js');
      if (connection) connection.end();
      return Promise.resolve(results);
    } catch (e) {
      if (connection) connection.end();
      return Promise.reject('at query in database.js: ' + e);
    }
  }
}

export {Database}
