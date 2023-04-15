export const FORCE_UNPLUGGED_PACKAGES = new Set([
  'nan',
  'node-gyp',
  'node-pre-gyp',
  'node-addon-api',
  'fsevents',
  'core-js',
  'core-js-pure',
  'protobufjs',
])

export const UNUSED_EXTERNALS = {
  // nestjs
  'cli-color': 'import cli-color',
  flaschenpost: 'import flaschenpost',
  'amqp-connection-manager': 'import amqp-connection-manager',
  amqplib: 'import amqplib',
  redis: 'import redis',
  mqtt: 'import mqtt',
  nats: 'import nats',
  '@nestjs/websockets': 'import @nestjs/websockets',

  // typeorm
  'typeorm-aurora-data-api-driver': 'import typeorm-aurora-data-api-driver',
  'react-native-sqlite-storage': 'import react-native-sqlite-storage',
  '@sap/hana-client': 'import @sap/hana-client',
  'better-sqlite3': 'import better-sqlite3',
  mongodb: 'import mongodb',
  oracledb: 'import oracledb',
  'pg-native': 'import pg-native',
  mysql: 'import mysql',
  ioredis: 'import ioredis',
  'hdb-pool': 'import hdb-pool',
  mysql2: 'import mysql2',
  mssql: 'import mssql',
  'sql.js': 'import sql.js',

  // pnp
  pnpapi: 'import pnpapi',

  // nextjs
  next: 'import next',
}
